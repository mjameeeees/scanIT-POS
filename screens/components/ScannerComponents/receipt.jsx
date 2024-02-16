import React from "react";
import {
  View,
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import {
  getAllTransactionsReceipt,
  getAllTransactionsByReceiptNo,
  getLatestInTransactionByReceiptNo,
} from "../../../integration/transfer_receipt";
import { useState, useEffect } from "react";
import moment from "moment";
import { TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { rollbackTransaction } from "../../../integration/void_receipts";
import VoidTransactionDetails from "../../dashboard/voids";

const Receipt = ({ isVisiblePay, route }) => {
  const navigation = useNavigation();
  const {
    receiptno,
    selectedItems,
    changedValue,
    totalSum,
    currentDate,
    formattedTime,
    ...restParams
  } = route.params;

  const [transactions, setTransactions] = useState(selectedItems);
  const [securityCode, setSecurityCode] = useState("");
  const [isVisibleVoid, setIsVisibleVoid] = useState(false);
  const [isVisibleVoidDetails, setIsVisibleVoidDetails] = useState(false);

  console.log("Receipt Screen: ", selectedItems);
  const updatedParams = {
    receiptno,
    selectedItems: [], // Empty selectedItems
    changedValue,
    totalSum,
    currentDate,
    formattedTime,
    ...restParams,
  };
  const toNextTransaction = () =>{
    updatedParams();
   navigation.navigate("Scanner");
  }
  const generateRandomString = () => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    let randomString = "";

    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      randomString += alphabet.charAt(randomIndex);
    }

    return randomString;
  };
  const [randomLetters, setRandomLetters] = useState(() =>
    generateRandomString()
  );

  const handleGenerateRandomString = () => {
    const newRandomLetters = generateRandomString();
    setRandomLetters(newRandomLetters);
  };

  const voids = () => {
    setIsVisibleVoid(true);
    handleRollback()
  };

  const handleRollback = () => {
    rollbackTransaction()
      .then((message) => {
        console.log(message);
        // Handle success, if needed
      })
      .catch((error) => {
        console.error(error);
        // Handle error, if needed
      });
  };

  return (
    <View>
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

      <View
        style={{
          alignSelf: "flex-end",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          marginRight: 10,
          marginTop: 10,
          marginBottom: 10, // Add margin for better spacing between transactions
          width: "80%",
        }}
      >
        <TouchableOpacity onPress={() =>
                navigation.navigate("TransactionDetails", {
                  transactionid: receiptno,
                })
              } style={styles.circle}>
          <Image
            source={require("./download.png")}
            
            style={{
              marginRight: 10,
              height: 20,
              width: 20,
              shadowColor: "#d9d9d9",
              shadowOffset: { width: 0, height: 0 },
              shadowRadius: 5,
            }}
          />
        </TouchableOpacity>

        <Text
          style={{
            fontFamily: "DMSansRegular",
            fontSize: 13,
            padding: 10,
            borderWidth: 1,
            
            flex: 1, // Allow text to take remaining space
            textAlign: "center",
          }}
        >
          Receipt No: {receiptno}
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
        <Text style={{ fontFamily: "DMSansRegular", fontSize: 10, margin: 10 }}>
          Price
        </Text>
        <Text style={{ fontFamily: "DMSansRegular", fontSize: 10, margin: 10 }}>
          Quantity
        </Text>
        <Text style={{ fontFamily: "DMSansRegular", fontSize: 10, margin: 10 }}>
          Total Amount
        </Text>
      </View>

      <View style={{ height: "40%" }}>
        <FlatList
          data={selectedItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: index % 2 === 0 ? "#d3d3d3" : "transparent",
              }}
            >
              {/* Your existing view components */}
              {/* Replace items with item in the following Text components */}
              <View style={{ alignSelf: "flex-start", width: 150 }}>
                <Text
                  style={{
                    fontFamily: "DMSansBold",
                    fontSize: 10,
                    marginVertical: 5,
                    marginHorizontal: 10,
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontFamily: "DMSansRegular",
                    fontSize: 9,
                    marginHorizontal: 10,
                    marginBottom: 10,
                  }}
                >
                  ({item.code})
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "flex-start",
                  width: 200,
                  left: 15
                }}
              >
                <Text
                  style={{
                    fontFamily: "DMSansRegular",
                    fontSize: 10,
                    margin: 5,
                    textAlign: "left",
                  }}
                >
                  {item.srp}
                </Text>
                <Text
                  style={{
                    fontFamily: "DMSansRegular",
                    fontSize: 10,
                    margin: 5,
                    textAlign: "left",
                  }}
                >
                  {item.quantity}
                </Text>
                <Text
                  style={{
                    fontFamily: "DMSansRegular",
                    fontSize: 10,
                    margin: 5,
                    textAlign: "left",
                  }}
                >
                  {item.srp * item.quantity}
                </Text>
              </View>
            </View>
          )}
        />
      </View>

      <View style={styles.line}></View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          margin: 20,
          width: '100%'
        }}
      >
        <View style={{ left: 15}}>
          <Text style={{ fontFamily: "DMSansRegular", fontSize: 10 }}>
            Date: {currentDate}
          </Text>
          <Text style={{ fontFamily: "DMSansRegular", fontSize: 10 }}>
            Time: {formattedTime}
          </Text>
        </View>
        <View style={{ right: 55 }}>
          <View></View>
          <Text
            style={{
              fontFamily: "DMSansRegular",
              fontSize: 10,
              textAlign: "right",
            }}
          >
            Received: <Text>{changedValue}</Text>{" "}
          </Text>
          <Text
            style={{
              fontFamily: "DMSansRegular",
              fontSize: 10,
              textAlign: "right",
            }}
          >
            Total Amount: <Text>{totalSum}</Text>{" "}
          </Text>
          <Text
            style={{
              fontFamily: "DMSansRegular",
              fontSize: 10,
              textAlign: "right",
            }}
          >
            Changed: <Text>{changedValue - totalSum}</Text>{" "}
          </Text>
        </View>
      </View>
      <View style={styles.line}></View>

      <View
        style={{ justifyContent: "center", alignItems: "center", margin: 20 }}
      >
        <TouchableOpacity
            style={{
            elevation: 5,
            padding: 15,
            width: "70%",
            backgroundColor: "#ED254E",
            borderRadius: 50,
          }}
          onPress={() => navigation.navigate("Scanner")}

        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: "DMSansBold",
              color: "#f4fffd",
            }}
          >
            NEXT TRANSACTION
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            marginTop: 10,
            width: "70%",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Dashboard")}
            style={{
              elevation: 5,
              padding: 15,
              width: "60%",
              backgroundColor: "#ED254E",
              borderRadius: 50,
            }}
          >
            <Text
              style={{
                fontFamily: "DMSansBold",
                textAlign: "center",
                color: "#f4fffd",
              }}
            >
              HOME
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsVisibleVoidDetails(true)}
            style={{
              elevation: 5,
              padding: 15,
              width: "35%",
              backgroundColor: "#465362",
              borderRadius: 50,
            }}
          >
            <Text
              style={{
                fontFamily: "DMSansBold",
                textAlign: "center",
                color: "#f4fffd",
              }}
            >
              VOID
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <Modal
            visible={isVisibleVoidDetails}
            onRequestClose={() => setIsVisibleVoidDetails(false)}
          >
            <View style={{ backgroundColor: "#011936", padding: 10 }}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 15,
                  fontFamily: "DMSansBold",
                  color: "#f4fffd",
                }}
              >
                VOID TRANSACTION
              </Text>
            </View>
            <View
              style={{
                height: "50%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "DMSansBold",
                  fontSize: 25,
                  marginBottom: 20,
                }}
              >
                VOID CONFIRM
              </Text>
              <Text style={{ fontFamily: "DMSansBold", fontSize: 10 }}>
                Enter Security Code to Confirm
              </Text>
              <TextInput
                value={securityCode}
                onChangeText={(text) => setSecurityCode(text)}
                style={{
                  borderWidth: 1,
                  width: 200,
                  height: 50,
                  fontSize: 25,
                  textAlign: "center",
                }}
              />
              <Text style={{ fontFamily: "DMSansMedium", opacity: 0.5 }}>
                {randomLetters}
              </Text>
              <TouchableOpacity
                onPress={voids}
                disabled={securityCode != randomLetters}
                style={{
                  padding: 20,
                  backgroundColor:
                    securityCode !== randomLetters ? "gray" : "#ED254E",
                  borderRadius: 100,
                  width: 150,
                  top: 30,
                }}
              >
                <Text
                  style={{
                    fontFamily: "DMSansMedium",
                    fontSize: 10,
                    textAlign: "center",
                  }}
                >
                  CONFIRM
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>

          <Modal
            visible={isVisibleVoid}
            onRequestClose={() => setIsVisibleVoidDetails(false)}
          >
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

              <View
                style={{
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                }}
              >
                <Text
                  style={{
                    fontFamily: "DMSansRegular",
                    fontSize: 13,
                    margin: 20,
                    borderWidth: 1,
                    padding: 10,
                  }}
                >
                  Receipt No: {receiptno}
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
                <Text
                  style={{
                    fontFamily: "DMSansMedium",
                    fontSize: 10,
                    margin: 10,
                  }}
                >
                  Price
                </Text>
                <Text
                  style={{
                    fontFamily: "DMSansMedium",
                    fontSize: 10,
                    margin: 10,
                  }}
                >
                  Quantity
                </Text>
                <Text
                  style={{
                    fontFamily: "DMSansMedium",
                    fontSize: 10,
                    margin: 10,
                  }}
                >
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
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <View style={{ alignSelf: "flex-start", width: 150, marginLeft:10 }}>
                        <Text
                          style={{ fontFamily: "DMSansBold", fontSize: 10 }}
                        >
                          {item.name}
                        </Text>
                        <Text
                          style={{ fontFamily: "DMSansRegular", fontSize: 9 }}
                        >
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
                          {item.srp}
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
                          {item.srp * item.quantity}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              />
              <View>
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
                      <Text
                        style={{ fontFamily: "DMSansRegular", fontSize: 10 }}
                      >
                        Date: {currentDate}
                      </Text>
                      <Text
                        style={{ fontFamily: "DMSansRegular", fontSize: 10 }}
                      >
                        Time: {formattedTime}
                      </Text>
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
                          {changedValue}
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
                          {totalSum}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={{width: '100%', justifyContent: "center", alignItems:"center", padding:10}}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Dashboard")}
                      style={{
                        elevation: 5,
                        padding: 15,
                        width: "60%",
                        backgroundColor: "#ED254E",
                        borderRadius: 50,
                        margin:5
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "DMSansBold",
                          textAlign: "center",
                          color: "#f4fffd",
                        }}
                      >
                        NEW TRANSACTION
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Dashboard")}
                      style={{
                        elevation: 5,
                        padding: 15,
                        width: "60%",
                        backgroundColor: "#ED254E",
                        borderRadius: 50,
                        margin:5
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "DMSansBold",
                          textAlign: "center",
                          color: "#f4fffd",
                        }}
                      >
                        HOME
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              </View>
            </View>
          </Modal>
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
    height: "100%",
    backgroundColor: "#DBF9F0",
  },
  transactionboard: {
    width: "100%",
    height: 50,
    backgroundColor: "#011936",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",

    fontFamily: "DMSansBold",
  },
  line: {
    marginTop: 20,
    width: "80%", // You can adjust the width as needed
    height: 0.5, // You can adjust the height as needed
    backgroundColor: "black", // You can adjust the color as needed
    alignSelf: "center",
  },
  bounds: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "white",
    width: 200, // Adjust the width of the scanning area
    height: 200, // Adjust the height of the scanning area
    opacity: 0.5,
  },

  scanner: {
    width: "90%",
    height: "40%",
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    top: "3%",
  },

  label: {
    marginRight: 5, // Add some spacing between the label and input
  },
  input: {
    flex: 1, // Allow the input to take up remaining space
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    padding: 1,
  },
  items_list: {
    flexDirection: "row",
    bottom: 20,
    width: 100,
    justifyContent: "space-evenly",
  },
  products_list: {
    flexDirection: "row",
    bottom: 90,
    width: 400,
    justifyContent: "space-evenly",
  },
  products: {
    paddingLeft: 10,
  },
  pay_button: {
    width: 360,
    height: 100,
    backgroundColor: "#ed254e",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Receipt;
