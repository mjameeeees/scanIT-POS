import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";

import { getAllUniqueTransactionIds } from "../../integration/transfer_receipt";
const Transaction = ({ navigation }) => {
  const TransactionDetails = () => {
    /*Navigators for Salestracker*/
    navigation.navigate("TransactionDetails");
  };

  const [uniqueTransactionIds, setUniqueTransactionIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reversedArrayPages, setReversedArrayPages] = useState([]);
  const pageSize = 8;

  const data = [...reversedArrayPages].reverse();

  useEffect(() => {
    getAllUniqueTransactionIds()
      .then((data) => {
        const latestTransaction = data.reverse();
        setUniqueTransactionIds(latestTransaction);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching unique transactionids:", error);
      });
  }, []);

  useEffect(() => {
    const pages = createPages(uniqueTransactionIds, pageSize);
    setReversedArrayPages((prevState) => {
      // Using the previous state ensures you're working with the latest state
      console.log("All Logs: ", pages);
      return pages;
    });
  }, [uniqueTransactionIds, pageSize]);

  const createPages = (array, pageSize) => {
    const reversedArray = array.slice().reverse();
    const pageCount = Math.ceil(reversedArray.length / pageSize);

    return Array.from({ length: pageCount }, (_, pageIndex) => {
      const startIndex = pageIndex * pageSize;
      const endIndex = startIndex + pageSize;
      return reversedArray.slice(startIndex, endIndex);
    });
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= reversedArrayPages.length) {
      setCurrentPage(page);
      console.log(currentPage);
    }
  };

  const displayedReceiptNos = new Set();

  return (
    <View style={styles.scannerui}>
      <View style={styles.transactionboard}>
        <Text
          style={{
            fontFamily: "DMSansBold",
            fontSize: 20,
            color: "white",
            textAlign: "center",
          }}
        >
          Receipt
        </Text>
      </View>
      <View style={{ height: "80%", top: 20 }}>
        <Text
          style={{ textAlign: "center", bottom: 10, fontFamily: "DMSansBold" }}
        >{`Page ${currentPage} `}</Text>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {reversedArrayPages[currentPage - 1]?.map((item, index) => {
            // Display only if the receipt_no hasn't been displayed before
            if (!displayedReceiptNos.has(item.receipt_no)) {
              displayedReceiptNos.add(item.receipt_no);

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    navigation.navigate("TransactionDetails", {
                      transactionid: item.receipt_no,
                    })
                  }
                >
                  <View
                    style={{ flexDirection: "row", justifyContent: "center" }}
                  >
                    <View
                      style={{
                        borderWidth: 0.5,
                        width: "90%",
                        padding: 13,
                        margin: 5,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: 9, fontFamily: "DMSansMedium" }}>
                        {item.date} | {item.time}
                      </Text>
                      <Text style={{ fontSize: 9, fontFamily: "DMSansMedium" }}>
                        ({item.receipt_no})
                      </Text>
                      {/* Add more Text components or styling for other receipt information */}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }
          })}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              width: 400,
            }}
          >
            <Button
              title="Previous"
              onPress={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            />
            <Button
              title="Next"
              onPress={() => goToPage(currentPage + 1)}
              disabled={currentPage === reversedArrayPages.length}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scannerui: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  transactionboard: {
    width: "100%",
    height: 50,
    backgroundColor: "#011936",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Transaction;
