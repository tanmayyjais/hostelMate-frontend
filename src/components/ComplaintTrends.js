// components/ComplaintTrends.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Button } from "react-native-paper";
import axios from "axios";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { baseUrl } from "../config/BaseUrl";

const screenWidth = Dimensions.get("window").width;

const ComplaintTrends = ({ token }) => {
  const [range, setRange] = useState("week");
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${baseUrl}stats/complaints?range=${range}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formattedData = {
        labels: res.data.map((item) => `${item._id.day}/${item._id.month}`),
        datasets: [{ data: res.data.map((item) => item.count) }],
      };

      setChartData(formattedData);
    } catch (err) {
      console.log("Stats fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [range]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complaint Trends</Text>
      <View style={styles.buttonRow}>
        {["week", "month", "3months"].map((r) => (
          <Button
            key={r}
            mode={range === r ? "contained" : "outlined"}
            onPress={() => setRange(r)}
            style={styles.button}
          >
            {r === "week" ? "This Week" : r === "month" ? "This Month" : "Last 3 Months"}
          </Button>
        ))}
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <BarChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          fromZero
          chartConfig={{
            backgroundColor: "#f8f9fa",
            backgroundGradientFrom: "#f8f9fa",
            backgroundGradientTo: "#f8f9fa",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={styles.chart}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginTop: 20,
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  button: {
    borderRadius: 20,
  },
  chart: {
    borderRadius: 10,
  },
});

export default ComplaintTrends;
