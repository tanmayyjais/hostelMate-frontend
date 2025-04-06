import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  TouchableOpacity,
  Animated,
  Alert,
  Keyboard,
} from "react-native";
import { Avatar } from "react-native-paper";
import Markdown from "react-native-markdown-display";
import { lexruntime } from "../config/awsLex";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const sessionId = uuid.v4();

const LexChatBot = ({ navigation }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const flatListRef = useRef(null);
  
  // Enhanced animation setup with more explicit values
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;
  const greetingOpacity = useRef(new Animated.Value(1)).current;

  // Critical fix: This function is now directly controlling animations without loops
  const startTypingAnimation = () => {
    // Reset animation values first
    dot1Anim.setValue(0);
    dot2Anim.setValue(0);
    dot3Anim.setValue(0);
    
    // Create a sequence that repeats indefinitely
    Animated.loop(
      Animated.sequence([
        // First dot animation
        Animated.timing(dot1Anim, { 
          toValue: 1, 
          duration: 400, 
          useNativeDriver: true 
        }),
        // Second dot animation (with slight overlap)
        Animated.timing(dot2Anim, { 
          toValue: 1, 
          duration: 400, 
          useNativeDriver: true 
        }),
        // Third dot animation (with slight overlap)
        Animated.timing(dot3Anim, { 
          toValue: 1, 
          duration: 400, 
          useNativeDriver: true 
        }),
        // Reset first dot
        Animated.timing(dot1Anim, { 
          toValue: 0.3, 
          duration: 400, 
          useNativeDriver: true 
        }),
        // Reset second dot
        Animated.timing(dot2Anim, { 
          toValue: 0.3, 
          duration: 400, 
          useNativeDriver: true 
        }),
        // Reset third dot
        Animated.timing(dot3Anim, { 
          toValue: 0.3, 
          duration: 400, 
          useNativeDriver: true 
        }),
      ])
    ).start();
  };

  // Stop animation function to ensure clean-up
  const stopTypingAnimation = () => {
    dot1Anim.stopAnimation();
    dot2Anim.stopAnimation();
    dot3Anim.stopAnimation();
  };

  // Fade out animation for greeting
  const fadeOutGreeting = () => {
    Animated.timing(greetingOpacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setShowGreeting(false));
  };

  const getDateLabel = (timestamp) => {
    const date = new Date(timestamp).toDateString();
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (date === today) return "Today";
    if (date === yesterday) return "Yesterday";
    return new Date(timestamp).toLocaleDateString();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const loadChat = async () => {
    try {
      const saved = await AsyncStorage.getItem("chat");
      if (saved) {
        const parsedChat = JSON.parse(saved);
        setMessages(parsedChat);
        // Hide greeting if there are previous messages
        if (parsedChat.length > 0) {
          setShowGreeting(false);
        }
      }
    } catch (error) {
      console.error("Error loading chat:", error);
    }
  };

  const saveChat = async () => {
    try {
      await AsyncStorage.setItem("chat", JSON.stringify(messages));
    } catch (error) {
      console.error("Error saving chat:", error);
    }
  };

  useEffect(() => {
    loadChat();
  }, []);

  useEffect(() => {
    if (messages.length > 0) saveChat();
    scrollToBottom();
  }, [messages]);

  // Critical fix: Separated effect for animation control
  useEffect(() => {
    if (isTyping) {
      // Start animation when typing begins
      startTypingAnimation();
    } else {
      // Stop animation when typing ends
      stopTypingAnimation();
    }
    
    // Cleanup function to stop animations when component unmounts
    return () => {
      stopTypingAnimation();
    };
  }, [isTyping]);

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const clearChat = () => {
    Alert.alert(
      "Clear Chat",
      "Are you sure you want to clear the entire conversation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            setMessages([]);
            await AsyncStorage.removeItem("chat");
            setShowGreeting(true);
            // Reset greeting opacity animation
            greetingOpacity.setValue(1);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Handle first message and greeting
    if (showGreeting) {
      fadeOutGreeting();
    }
    
    const timestamp = new Date().toISOString();
    const userMessage = { sender: "user", text: input.trim(), timestamp };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    
    // CRITICAL FIX: Set typing indicator BEFORE the API call
    setIsTyping(true);
    
    Keyboard.dismiss();

    const params = {
      botAliasId: "TSTALIASID",
      botId: "KWXIOTZDRV",
      localeId: "en_US",
      sessionId,
      text: input.trim(),
    };

    try {
      // Show typing indicator for at least 1 second before API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await lexruntime.recognizeText(params).promise();
      const botReply = response.messages?.[0]?.content || "Sorry, I didn't understand that. Could you rephrase?";
      
      // Add a realistic typing delay based on message length
      const typingDelay = Math.min(Math.max(botReply.length * 15, 1500), 3000);
      
      // Ensure typing indicator stays visible for a minimum duration
      setTimeout(() => {
        const botTimestamp = new Date().toISOString();
        setMessages((prev) => [...prev, { sender: "bot", text: botReply, timestamp: botTimestamp }]);
        // CRITICAL FIX: Only turn off typing indicator AFTER adding the message
        setIsTyping(false);
      }, typingDelay);
    } catch (err) {
      console.error("Lex error:", err);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev, 
          { 
            sender: "bot", 
            text: "I'm having trouble connecting right now. Please try again later.", 
            timestamp: new Date().toISOString() 
          }
        ]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const renderItem = ({ item, index }) => {
    const prev = messages[index - 1];
    const showDate = !prev || getDateLabel(prev.timestamp) !== getDateLabel(item.timestamp);
    
    // Check if this is the first message of a new sender group
    const isNewSenderGroup = !prev || prev.sender !== item.sender;
    
    return (
      <View>
        {showDate && (
          <Text style={styles.dateLabel}>{getDateLabel(item.timestamp)}</Text>
        )}
        <View 
          style={[
            item.sender === "user" ? styles.userRow : styles.botRow,
            isNewSenderGroup && { marginTop: 12 }
          ]}
        >
          {(isNewSenderGroup || showDate) && (
            <Avatar.Image
              size={32}
              source={
                item.sender === "bot"
                  ? require("../../assets/images/VNIT.png")
                  : require("../../assets/images/profile_pic.png")
              }
              style={[styles.avatar, item.sender === "user" && styles.userAvatar]}
            />
          )}
          <View style={[
            item.sender === "user" ? styles.userMsg : styles.botMsg,
            !isNewSenderGroup && !showDate && 
              (item.sender === "user" ? styles.userFollowupMsg : styles.botFollowupMsg)
          ]}>
            <Markdown style={markdownStyles}>{item.text}</Markdown>
            <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backBtn}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>College Assistant</Text>
        <TouchableOpacity 
          onPress={clearChat} 
          style={styles.clearBtn} 
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        >
          <MaterialCommunityIcons name="delete-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={scrollToBottom}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={10}
      />

      {showGreeting && messages.length === 0 && (
        <Animated.View style={[styles.greeting, { opacity: greetingOpacity }]}>
          <Avatar.Image
            size={64}
            source={require("../../assets/images/VNIT.png")}
            style={styles.greetingAvatar}
          />
          <Text style={styles.greetingTitle}>Hello there! 👋</Text>
          <Text style={styles.greetingText}>
            I'm the College Assistant. How can I help you today?
          </Text>
          <TouchableOpacity 
            style={styles.greetingButton} 
            onPress={() => {
              setInput("Tell me about campus facilities");
              setTimeout(() => {
                const inputField = document.getElementById("chatInput");
                if (inputField) inputField.focus();
              }, 100);
            }}
          >
            <Text style={styles.greetingButtonText}>Get started</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* CRITICAL FIX: Updated typing indicator with clearer styling and forced visibility */}
      {isTyping && (
        <View style={styles.typingIndicator}>
          <Avatar.Image
            size={28}
            source={require("../../assets/images/VNIT.png")}
            style={styles.typingAvatar}
          />
          <View style={styles.typingBubble}>
            <Animated.View 
              style={[
                styles.typingDot, 
                { 
                  opacity: dot1Anim,
                  transform: [{ scale: Animated.add(0.8, Animated.multiply(dot1Anim, 0.5)) }] 
                }
              ]} 
            />
            <Animated.View 
              style={[
                styles.typingDot, 
                { 
                  opacity: dot2Anim,
                  transform: [{ scale: Animated.add(0.8, Animated.multiply(dot2Anim, 0.5)) }] 
                }
              ]} 
            />
            <Animated.View 
              style={[
                styles.typingDot, 
                { 
                  opacity: dot3Anim,
                  transform: [{ scale: Animated.add(0.8, Animated.multiply(dot3Anim, 0.5)) }] 
                }
              ]} 
            />
          </View>
        </View>
      )}

      <View style={styles.inputRow}>
        <TextInput
          id="chatInput"
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          style={styles.input}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
          placeholderTextColor="#aaa"
          multiline={true}
          maxLength={500}
          numberOfLines={Platform.OS === 'ios' ? null : 1}
        />
        <TouchableOpacity 
          onPress={sendMessage} 
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]} 
          activeOpacity={0.7}
          disabled={!input.trim()}
        >
          <MaterialCommunityIcons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const markdownStyles = {
  body: {
    fontSize: 15,
    color: "#333",
    lineHeight: 21,
  },
  code_block: {
    backgroundColor: "#f4f4f4",
    padding: 8,
    borderRadius: 4,
    fontSize: 14,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  code_inline: {
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 4,
    borderRadius: 4,
    fontSize: 14,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  link: {
    color: "#006aff",
    textDecorationLine: "underline" as "underline",
  },
  bullet_list: {
    marginVertical: 6,
  },
  ordered_list: {
    marginVertical: 6,
  },
};

const styles = StyleSheet.create({
  wrapper: { 
    flex: 1, 
    backgroundColor: "#f8f9fa" 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#006aff",
    paddingHorizontal: 16,
    paddingVertical: 14, // Reduced from 16
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    justifyContent: "space-between",
  },
  backBtn: { 
    padding: 4,
  },
  clearBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18, // Reduced from 20
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  },
  messagesContainer: {
    padding: 12, // Reduced from 14
    paddingBottom: 100,
  },
  userRow: { 
    flexDirection: "row-reverse", 
    alignItems: "flex-end", 
    marginBottom: 2,
    marginTop: 2,
  },
  botRow: { 
    flexDirection: "row", 
    alignItems: "flex-end", 
    marginBottom: 2,
    marginTop: 2,
  },
  avatar: {
    marginHorizontal: 4,
    backgroundColor: "transparent",
  },
  userAvatar: {
    marginLeft: 8,
    marginRight: 2,
  },
  userMsg: {
    backgroundColor: "#dcfce7",
    padding: 10, // Reduced from 12
    marginHorizontal: 6, // Reduced from 8
    borderRadius: 16, // Reduced from 18
    borderBottomRightRadius: 4,
    maxWidth: "70%", // Reduced from 75%
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  botMsg: {
    backgroundColor: "#f0f0f0",
    padding: 10, // Reduced from 12
    marginHorizontal: 6, // Reduced from 8
    borderRadius: 16, // Reduced from 18
    borderBottomLeftRadius: 4,
    maxWidth: "70%", // Reduced from 75%
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  userFollowupMsg: {
    borderTopRightRadius: 10, // Reduced from full radius
    marginRight: 40, // Reduced from 44
  },
  botFollowupMsg: {
    borderTopLeftRadius: 10, // Reduced from full radius
    marginLeft: 40, // Reduced from 44
  },
  timestamp: {
    fontSize: 10, // Reduced from 11
    color: "#888",
    alignSelf: "flex-end",
    marginTop: 3, // Reduced from 4
  },
  dateLabel: {
    alignSelf: "center",
    fontSize: 12, // Reduced from 13
    color: "#999",
    marginVertical: 12, // Reduced from 14
    paddingHorizontal: 10, // Reduced from 12
    paddingVertical: 3, // Reduced from 4
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 10, // Reduced from 12
    overflow: "hidden",
  },
  // Improved typing indicator styling
  typingIndicator: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    marginLeft: 40, // Align with the bot messages
    marginBottom: 8,
    position: "absolute", 
    bottom: 70, // Position above the input box
    zIndex: 10, // Ensure it's above other elements
  },
  typingBubble: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 28,
    width: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  typingDot: {
    height: 5,
    width: 5,
    borderRadius: 2.5,
    backgroundColor: "#666",
    marginHorizontal: 2,
  },
  inputRow: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 10, // Reduced from 12
    paddingHorizontal: 14, // Reduced from 16
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 14, // Reduced from 16
    paddingVertical: 8, // Reduced from 12
    backgroundColor: "#f5f5f5",
    borderRadius: 20, // Reduced from 24
    fontSize: 14, // Reduced from 15
    borderWidth: 1,
    borderColor: "#e5e5e5",
    maxHeight: 100,
    minHeight: 40, // Reduced from 46
  },
  sendButton: {
    marginLeft: 10, // Reduced from 12
    backgroundColor: "#006aff",
    padding: 10, // Reduced from 12
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 40, // Reduced from 46
    height: 40, // Reduced from 46
    shadowColor: "#006aff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: "#a0c4ff",
    shadowOpacity: 0.1,
  },
  greeting: {
    position: "absolute",
    top: "25%",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24, // Reduced from 30
    paddingHorizontal: 24, // Reduced from 30
  },
  greetingAvatar: {
    marginBottom: 16, // Reduced from 20
    backgroundColor: "transparent",
  },
  greetingTitle: {
    fontSize: 22, // Reduced from 24
    fontWeight: "700",
    color: "#333",
    marginBottom: 8, // Reduced from 10
  },
  greetingText: {
    fontSize: 15, // Reduced from 16
    color: "#666",
    textAlign: "center",
    lineHeight: 20, // Reduced from 22
    marginBottom: 20, // Reduced from 24
  },
  greetingButton: {
    backgroundColor: "#006aff",
    paddingVertical: 10, // Reduced from 12
    paddingHorizontal: 18, // Reduced from 20
    borderRadius: 18, // Reduced from 24
    shadowColor: "#006aff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  greetingButtonText: {
    color: "#fff",
    fontSize: 15, // Reduced from 16
    fontWeight: "600",
  },
  typingAvatar: {
    backgroundColor: "transparent",
    marginRight: 6,
  },
});

export default LexChatBot;