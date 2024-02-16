import {
  StyleSheet,
  Text,
  View,
 
  FlatList,
  
} from "react-native";
import { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

import { getVoidReceiptsByReceiptNo } from "../../integration/void_receipts";

const VoidTransactionDetails = ({ navigation }) => {
  const route = useRoute();

  const [transactions, setTransactions] = useState([]);

  const { transactionid } = route.params; // Pass receiptNo as a parameter

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const transactionsData = await getVoidReceiptsByReceiptNo(transactionid);
      setTransactions(transactionsData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
    console.log("Data In Receipt: ", transactions);
  };

  const filteredTransactions = transactions.filter(
    (transaction) => transaction.receipt_no === transactionid
  );

  const items = filteredTransactions[0];

  return (
    <View style={{ height: "100%" }}>
      <View style={{ backgroundColor: "#011936", padding: 10 }}>
        <Text
          style={{
            textAlign: "center",
            fontSize: 15,
            fontFamily: "DMSansBold",
            color: "#f4fffd",
          }}
        >
          VOID RECEIPT
        </Text>
      </View>

      <View style={{ justifyContent: "flex-end", alignItems: "flex-end" }}>
        <Text
          style={{
            fontFamily: "DMSansRegular",
            fontSize: 13,
            margin: 20,
            borderWidth: 1,
            padding: 10,
          }}
        >
          Receipt No: {transactionid}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          width: "100%",
        }}
      >
        <Text style={{ fontFamily: "DMSansMedium", fontSize: 10, margin: 10 }}>
          Price
        </Text>
        <Text style={{ fontFamily: "DMSansMedium", fontSize: 10, margin: 10 }}>
          Quantity
        </Text>
        <Text style={{ fontFamily: "DMSansMedium", fontSize: 10, margin: 10 }}>
          Total Amount
        </Text>
      </View>

      <FlatList
        data={transactions}
        renderItem={({ item }) => (
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              <View
                style={{
                  alignSelf: "flex-start",
                  justifyContent: "center",
                  width: 150,
                  marginLeft: 10,
                }}
              >
                <Text style={{ fontFamily: "DMSansBold", fontSize: 10 }}>
                  {item.name}
                </Text>
                <Text style={{ fontFamily: "DMSansRegular", fontSize: 9 }}>
                  ({item.code})
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  width: 200,
                }}
              >
                <Text
                  style={{
                    fontFamily: "DMSansRegular",
                    fontSize: 10,
                    textAlign: "left",
                  }}
                >
                  {item.price}
                </Text>
                <Text
                  style={{
                    fontFamily: "DMSansRegular",
                    fontSize: 10,
                    textAlign: "left",
                  }}
                >
                  {item.quantity}
                </Text>
                <Text
                  style={{
                    fontFamily: "DMSansRegular",
                    fontSize: 10,
                    textAlign: "left",
                  }}
                >
                  {item.total_amount}
                </Text>
              </View>
            </View>
          </View>
        )}
      />

      <View>
        {items && (
          <>
            <View style={styles.line}></View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                margin: 20,
              }}
            >
              <View>
                {items.date && (
                  <Text style={{ fontFamily: "DMSansRegular", fontSize: 10 }}>
                    Date: {items.date}
                  </Text>
                )}
                {items.time && (
                  <Text style={{ fontFamily: "DMSansRegular", fontSize: 10 }}>
                    Time: {items.time}
                  </Text>
                )}
              </View>
              <View style={{ right: 50 }}>
                <View>
                  {/* Additional views or components can be added here */}
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      fontFamily: "DMSansRegular",
                      fontSize: 10,
                      textAlign: "right",
                      width: 80,
                    }}
                  >
                    Received:{" "}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "DMSansRegular",
                      fontSize: 10,
                      textAlign: "right",
                    }}
                  >
                    {items.recieved}
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      fontFamily: "DMSansRegular",
                      fontSize: 10,
                      textAlign: "right",
                      width: 80,
                    }}
                  >
                    Grand Total:{" "}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "DMSansRegular",
                      fontSize: 10,
                      textAlign: "right",
                    }}
                  >
                    {items.grand_total}
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scannerui: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  transactionboard: {
    width: "100%",

    backgroundColor: "#011936",
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    marginTop: 20,
    width: "80%", // You can adjust the width as needed
    height: 1, // You can adjust the height as needed
    backgroundColor: "black", // You can adjust the color as needed
    alignSelf: "center",
  },
  horizontalLine: {
    borderBottomColor: "#0000", // Change the color as needed
    borderBottomWidth: 1, // Change the thickness as needed
  },
});

export default VoidTransactionDetails;
