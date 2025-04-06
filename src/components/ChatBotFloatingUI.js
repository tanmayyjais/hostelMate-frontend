// ✅ Required imports
import { useState, useEffect } from "react";
import { Animated, TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const FloatingChatbot = ({ navigation }) => {
  const [showBubble, setShowBubble] = useState(true);
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "I'm here to help!";
  const typingInterval = 60; // ms per character

  useEffect(() => {
    let index = 0;
    let interval;
    if (showBubble) {
      setDisplayedText("");
      interval = setInterval(() => {
        if (index < fullText.length) {
          setDisplayedText((prev) => prev + fullText[index]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, typingInterval);
    }
    return () => clearInterval(interval);
  }, [showBubble]);

  const handleToggleBubble = () => {
    setShowBubble((prev) => !prev);
  };

  return (
    <View style={styles.chatbotFixedWrapper}>
      {showBubble && (
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.chatbotBubble}
          onPress={handleToggleBubble}
        >
          <Text style={styles.chatbotBubbleText}>💬 {displayedText}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => navigation.navigate("UserLexChatBot")}
        onLongPress={handleToggleBubble}
        style={styles.chatbotIconWrapper}
      >
        <MaterialCommunityIcons name="robot" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  chatbotFixedWrapper: {
    position: "absolute",
    bottom: 30,
    right: 25,
    zIndex: 999,
    alignItems: "flex-end",
  },
  chatbotBubble: {
    backgroundColor: "#007bff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
    maxWidth: 180,
    elevation: 4,
  },
  chatbotBubbleText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
  chatbotIconWrapper: {
    backgroundColor: "#007bff",
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});

export default FloatingChatbot;
