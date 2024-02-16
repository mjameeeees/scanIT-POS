import { TouchableOpacity } from "react-native";
import { StyleSheet, Text, View, TextInput } from "react-native";

import { useEffect, useState } from "react";

const Scanner_Payment = ({ navigation }) => {
  const Dashboard = () => {
    /*Navigators for Salestracker*/
    navigation.navigate("Dashboard");
  };
  const Receipt = () => {
    /*Navigators for Salestracker*/
    navigation.navigate("Transaction");
  };

  const [totalAmount, setTotalAmount] = useState(0);
  const [received, setReceived] = useState(0);
  const change = parseFloat(received) - totalAmount;

  const [latestTransactionId, setLatestTransactionId] = useState(null);


  return (
    <View style={styles.scannerui}>
      <View style={styles.transactionboard}>
        <Text style={styles.text}>Pay</Text>
      </View>
      <View style={styles.items_list}>
        <Text style={{ fontWeight: "bold" }}>Amount: {totalAmount}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontWeight: "bold" }}>Received: </Text>
          <TextInput
            style={{ fontWeight: "bold" }}
            placeholder="Type here... "
            onChangeText={(text) => setReceived(text)}
            value={received}
            keyboardType="numeric"
          />
        </View>

        <Text style={{ fontWeight: "bold" }}>Change: {change}</Text>
      </View>
      <TouchableOpacity
        onPress={Receipt}
        style={{
          backgroundColor: "#465362",
          padding: 10,
        }}
      >
        <Text style={{ color: "white" }}>
          Receipt for {latestTransactionId}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.pay_button,
          { backgroundColor: totalAmount > received ? "#CCCCCC" : "#ed254e" },
        ]}
        onPress={Dashboard}
        disabled={totalAmount > received}
      >
        <Text style={styles.text}>Next Transaction</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  scannerui: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionboard: {
    width: "100%",
    height: 150,
    backgroundColor: "#011936",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    color: "#ffffff",
    fontFamily: "DMSansBold",
    fontSize: 24,
  },
  scanner: {
    width: 200,
    height: 200,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
  },
  items_list: {
    flexDirection: "column",
    height: 200,
    width: 200,
    justifyContent: "space-evenly",
  },
  pay_button: {
    width: 360,
    height: 100,
    backgroundColor: "#ed254e",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Scanner_Payment;
