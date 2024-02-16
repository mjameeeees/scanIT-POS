import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";
import { ToastAndroid } from "react-native";
import { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";

import {
  getAllTransactionsReceipt,
  getAllTransactionsByReceiptNo,
} from "../../integration/transfer_receipt";

import { Toast } from "react-native-toast-message/lib/src/Toast";

const TransactionDetails = ({ navigation, receiptno }) => {
  const route = useRoute();

  const [data, setData] = useState([]);
  const [pdfPath, setPdfPath] = useState(null);

  const [transactions, setTransactions] = useState([]);

  const { transactionid } = route.params; // Pass receiptNo as a parameter

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const transactionsData = await getAllTransactionsByReceiptNo(
        transactionid
      );
      setTransactions(transactionsData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
    console.log("Data In Receipt: ", transactions);
  };

  const showToast = () => {
    ToastAndroid.show("New Product Inserted!", ToastAndroid.SHORT);
  };

  const exportData = (id) => {
    generatePDF(id);
  };

  const generatePDF = async (recentAggregatedReport) => {
    try {
      // Create HTML content for the PDF
      const htmlContent = `
  <style>
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
    h2 {
      text-align: center;
    }
    div{
      width: 100%;
    }
    .details {
      width: 90%;
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .code{
      font-size: 10
    }
  </style>
  <div> 
  <h1>Receipt No ${transactionid}</h1>
  ${filteredTransactions
    .map(
      (transaction) => `
    <div class="details"> 
      <p>Date: ${transaction.date}</p>
      <p>Time: ${transaction.time}</p>
      <p>Grand Total: ${transaction.grand_total}</p>
      <p>Received: ${transaction.recieved}</p>
    </div>
    <table>
      <tr>
        <th>Name</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>Total Amount</th>
      </tr>
      <tr>
        <td>${transaction.name} <p class="code">(${transaction.code})</p></td>
        <td>${transaction.price}</td>
        <td>${transaction.quantity}</td>
        <td>${transaction.total_amount}</td>
        <!-- Add more columns as needed -->
      </tr>
    </table>
  `
    )
    .join("")}
  </div>
`;

      // Convert HTML to PDF using react-native-html-to-pdf
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      // Define the path in the Download folder
      const downloadFolderPath = FileSystem.documentDirectory + "Download/";
      const pdfPath = downloadFolderPath + transactionid + " RECEIPT.pdf";

      // Create the Download folder if it doesn't exist
      await FileSystem.makeDirectoryAsync(downloadFolderPath, {
        intermediates: true,
      });

      // Move the generated PDF to the Download folder
      await FileSystem.moveAsync({
        from: uri,
        to: pdfPath,
      });
      sharePDF(pdfPath);

      console.log(`PDF saved to: ${pdfPath}`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };
  const sharePDF = async (pdfPath) => {
    // On Android, use the ACTION_SEND intent
    await Sharing.shareAsync(pdfPath, {
      mimeType: "application/pdf",
      dialogTitle: "Share PDF",
    });
  };

  const filteredTransactions = transactions.filter(
    (transaction) => transaction.receipt_no === transactionid
  );

  console.log("New", filteredTransactions);

  const [totalAmount, setTotalAmount] = useState(0);

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
          RECEIPT
        </Text>
      </View>

      <View style={{ justifyContent: "center", alignItems: "flex-end" }}>
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
        data={filteredTransactions}
        renderItem={({ item }) => (
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                width: "100%",
              }}
            >
              <View style={{ alignSelf: "flex-start", width: 150 }}>
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
      <TouchableOpacity
        onPress={() => {
          exportData(transactions);
        }}
        style={{
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
          borderRadius: 50,
          width: 250,
          height: 40,
          alignSelf: "center",
          margin: 30,
        }}
      >
        <Text style={{ fontFamily: "DMSansRegular" }}>Download Receipt</Text>
      </TouchableOpacity>
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

export default TransactionDetails;
