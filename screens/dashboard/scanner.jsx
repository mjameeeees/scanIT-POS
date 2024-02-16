import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  BackHandler,
  ScrollView,
} from "react-native";
import { Camera } from "expo-camera";
import RNSystemSounds from '@dashdoc/react-native-system-sounds';

import { useRef, memo } from "react";

import React, { useState, useEffect } from "react";
import { insertInventoryProduct } from "../../integration/inventory";
import moment from "moment";
import { TouchableWithoutFeedback } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  fetchProductDetailsFromDatabase,
  fetchProductDetailsFromDatabaseByName,
} from "../../integration/scannedItems";
import { fetchProductDetailsFromDatabaseSuggestions } from "../../integration/scannedItems";
import { insertReport } from "../../integration/report";
import { insertTransactionItems } from "../../integration/transaction";
import { insertBestProduct } from "../../integration/bestseller";
import ModalItems from "../components/ScannerComponents/modal";
import Cart from "../components/ScannerComponents/cart";
import SelectedItems from "../components/ScannerComponents/selectedItems";

const Scanner = ({ navigation, onBarcodeScanned, handleValueFromModal }) => {
  const Scanner_Payment = () => {
    /*Navigators for Scanner*/
    navigation.navigate("Scanner_Payment");
  };

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("Not yet scanned");

  const [product, setProduct] = useState(null);

  const [scannedProduct, setScannedProduct] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isZero, setIsZero] = useState(false);
  const [negate, setNegate] = useState(false);

  const [inputManual, setInputManual] = useState("");
  const [inputQuantity, setInputQuantity] = useState(1);

  const [inputmanualCode, setInputManualCode] = useState(""); // State for the manually entered code
  const [click, setClick] = useState(false);
  const [fixQuantity, setFixQuantity] = useState([]);

  const [isQuantityExceeded, setIsQuantityExceeded] = useState(false);
  const [isButtonClickable, setIsButtonClickable] = useState(false);
  const [received, setReceived] = useState(0);
  const [totalamount, setTotalAmount] = useState(0);


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


  const navigations = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const handleBackPress = () => {
      // Show the modal when the back button is pressed and there are selected items
      if (selectedItems.length > 0) {
        setModalVisible(true);
        return true; // Returning true prevents the default back behavior
      }
      return false; // Continue with the default back behavior
    };

    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    // Cleanup: Remove the event listener when the component is unmounted
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [selectedItems]);

  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures the effect runs only on mount and unmount

  // Extract hours, minutes, and seconds
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  // Format the time as HH:MM:SS
  const formattedTime = `${hours}:${minutes}:${seconds}`;

  const flatListRef = useRef(null);

  // Create a copy of the selectedItems array and add the new item to it
  const updatedItems = [...selectedItems, scannedProduct, inputmanualCode];

  const totalSum = selectedItems.reduce(
    (sum, item) => sum + item.quantity * item.srp,
    0
  );

  const totalCostSum = selectedItems.reduce(
    (sum, item) => sum + item.quantity * item.cost,
    0
  );

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  };

  // Request Camera Permission
  {
    /*useEffect(() => {
    askForCameraPermission();
  }, []);  */
  }

  const [suggestions, setSuggestions] = useState([]);
  const [inventoryIsEmpty, setInventoryIsEmpty] = useState(false);

  useEffect(() => {
    // Fetch suggestions based on the input value
    fetchProductDetailsFromDatabaseSuggestions(inputManual)
      .then((products) => {
        // Set the fetched products in the suggestions state
        setSuggestions(products);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
      });
  }, [inputManual]);

  const handleItemClick = (item) => {
    const currentStocks = { ...item, quantity: item.quantity };

    // Handle click event for each item
    const updatedScannedProduct = { ...item, quantity: 1 }; // Assuming you want to set quantity to 1

    // Update selectedItems state with the clicked item
    setSelectedItems([...selectedItems, updatedScannedProduct]);
    setInputManual("");
    // Update updatedItems state
  };

  // What happens when we scan the bar code
  const handleBarCodeScanned = async ({ data }) => {
    if (!scanned) {
      try {
        setScanned(true);
        setInputManual(data);
        console.log("This is", data);

        // Use useMemo to memoize the result of fetchProductDetailsFromDatabase
        const productDetails = fetchProductDetailsFromDatabase(data);

        console.log("Existing Quantity", fixQuantity);
        if (productDetails) {
          
          handleAddTransactionItem();
          setScannedProduct(productDetails);
          console.log("Data: ", productDetails);

          setProduct(productDetails);
        } else {
          console.log("Product not found in the database.");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        // Handle errors, e.g., display an error message to the user
      } finally {
        setScanned(false);
      }
    }
  };

  const handleAddTransactionItem = () => {
    flatListRef.current.scrollToEnd();
    const updatedScannedProduct = { ...scannedProduct };
    setClick(!click);
    if (scannedProduct && scannedProduct.code) { 
           
      // Check if the scanned product already exists in selectedItems
      const itemExists = selectedItems.some(
        (item) => item.code === scannedProduct.code
      );
      if (!itemExists) {
        RNSystemSounds.beep();
        setInventoryIsEmpty(false);

        // If the item doesn't exist in selectedItems, add it
        setSelectedItems([...selectedItems, updatedScannedProduct]);
        console.log("Suggestion: ", suggestions);

        console.log("Scanned product added to selectedItems");
        console.log("Selected Items", selectedItems);
      }
      setScannedProduct(null);
    } else {
      setInventoryIsEmpty(true);

      console.log("No product code provided or scanned product not found.");
    }

    /*----- For Manual Input -------- */
    const fetchData = async () => {
      try {
        // Fetch product details from the database based on the input
        const productArray = await fetchProductDetailsFromDatabase(inputManual);
        const name = await fetchProductDetailsFromDatabaseByName(inputManual);

        const newItemByCode = { ...productArray, quantity: 1 }; // Initialize quantity to 1
        const newItemByName = { ...name, quantity: 1 }; // Initialize quantity to 1
        console.log(selectedItems);
        if (
          productArray &&
          !selectedItems.some((item) => item.code === productArray.code)
        ) {
          const currentQuantity = productArray.code_quantity;
          console.log("currentQuantity: ", currentQuantity);
          // Update selectedItems state with newItem if it doesn't exist in selectedItems
          setSelectedItems([...selectedItems, newItemByCode]);
          // Update scannedProduct state with newItem
          setScannedProduct(newItemByCode);
          console.log("All Products Credited by code", newItemByCode);
          console.log("All Products Credited by codes", productArray);
        } else if (
          name &&
          !selectedItems.some((item) => item.name === name.name)
        ) {
          setInventoryIsEmpty(!inventoryIsEmpty);
          // Update selectedItems state with newItem if it doesn't exist in selectedItems
          setSelectedItems([...selectedItems, newItemByName]);
          // Update scannedProduct state with newItem
          setScannedProduct(newItemByName);
          console.log("Product Credited by Name", selectedItems); // Fix the log statement here
        } else {
          setInventoryIsEmpty(true);
          console.log(
            "Product not found in the database or already exists in selectedItems by name."
          );
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        // Handle errors, e.g., display an error message to the user
      }
    };

    fetchData();

    if (inputmanualCode && inputmanualCode.code) {
      // Check if the scanned product already exists in selectedItems
      const itemExists = selectedItems.some(
        (item) => item.code === inputmanualCode.code
      );
      if (!itemExists) {
        // If the item doesn't exist in selectedItems, add it
        setSelectedItems([...selectedItems, inputmanualCode]);
        console.log("input manualcode ", inputmanualCode);
        console.log("Scanned product added to selectedItems");
      } else {
        setInventoryIsEmpty(true);
        console.log("Item already exists in selectedItems.");
        console.log("Selected Items", selectedItems);
        console.log("Updated Items", updatedItems);
      }
      setScannedProduct(null);
    } else {
      console.log("No product code provided or scanned product not found.");
      console.log(inputManual);
    }
  };

  const [count, setCount] = useState(2);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productArray = await fetchProductDetailsFromDatabase(inputManual);

        if (productArray) {
          // Store the currently scanned product in scannedProduct
          setScannedProduct(productArray);
          console.log("All Products Credited by Fetch", productArray);

          console.log(productArray);
        } else {
          console.log("Product not found in the database.");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        // Handle errors, e.g., display an error message to the user
      }
    };
    fetchData();
  }, [count]);


  const [isCartModalVisible, setIsCartModalVisible] = useState(false);

  const openModal = () => {
    setIsCartModalVisible(true);
  };

  const closeModal = () => {
    setIsCartModalVisible(false);
  };

 // Check permissions and return the screens
  {
    /*if (hasPermission === null) {
    return (
      <View style={{alignItems: "center", justifyContent: "center"}}>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button
          title={"Allow Camera"}
          onPress={() => askForCameraPermission()}
        />
      </View>
    );
  }
  */
  }

  const handleDeleteToggle = (productCode) => {
    const updatedItems = selectedItems.filter(
      (item) => item.code !== productCode
    );
    setSelectedItems(updatedItems);
  };

  const getBackgroundColor = () => {
    // Set the color based on whether there are items in selectedItems or inputQuantity is zero
    return selectedItems.length > 0 && inputQuantity > 0 && isQuantityExceeded
      ? "#2ecc71"
      : "#95a5a6";
  };

  const generateTransactionId = () => {
    const timestamp = new Date().getTime(); // Get the current timestamp
    const random = Math.floor(Math.random() * 100); // Generate a random number
    return `${timestamp}-${random}`;
  };
  const transactionid = generateTransactionId(); // Generate a new unique transaction ID

  const [receiptno, setNewReceiptNo] = useState(transactionid);

  const handleValueChange = (value) => {
    console.log("Received value in Value:", value);
    setReceived(value);
    console.log("handle value", received);
  };

  const handleInsertItemsToDatabase = () => {
    console.log("Received", received);
    for (let i = 0; i < selectedItems.length; i++) {
      const currentDate = moment().format("YYYY-MM-DD");
      const item = updatedItems[i];

      if (item.name != null && item.quantity != null) {
        insertBestProduct(
          item.code,
          item.name,
          item.quantity,
          item.originalQuantity,
          item.unit,
          item.cost,
          item.srp,
          item.warnQuantity,
          item.expiryDate,
          item.location,
          item.purchaseDate,
          item.contact,
          item.category
        );
        insertInventoryProduct(
          item.code,
          item.name,
          item.quantity,
          item.original_quantity,
          item.unit,
          item.cost,
          item.srp,
          item.warninglevel,
          item.expiry_date,
          item.location,
          item.purchase_date,
          item.contact,
          item.category
        );

        // Insert the values into your function
        insertTransactionItems(
          receiptno,
          item.code,
          item.name,
          item.srp,
          item.quantity,
          item.srp * item.quantity,
          received,
          totalSum,
          currentDate,
          formattedTime
        );

        const profit = totalSum - totalCostSum;

        insertReport(currentDate, totalCostSum, totalSum, profit);
        
        
      }
      console.log("Handle Items", item);

      closeModal();
      const emptiedUpdatedItems = [];
      updatedItems.splice(0, updatedItems.length);

      setSelectedItems([]);
      updatedItems
    }
  };

 
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleOutsideClick = () => {
    setShowSuggestions(false);
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsideClick}>
      <View style={styles.scannerui}>
        <View style={styles.transactionboard}>
          <Text
            style={{
              fontFamily: "DMSansBold",
              fontSize: 15,
              color: "white",
              textAlign: "center",
            }}
          >
            New Transaction
          </Text>
        </View>
        <View
          style={{ justifyContent: "center", alignItems: "center", width: 200 }}
        >
          <ModalItems
            isVisible={isModalVisible}
            onClose={() => setModalVisible(false)}
          />

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              margin: 5,
              alignSelf: "center",
              height: 100,
              width: 250,
              overflow: "hidden",
            }}
          >
            <Text
              style={{
                width: "80%",
                justifyContent: "center",
                alignSelf: "center",
                alignItems: "center",
              }}
            >
              {/* Conditionally render the barcode scanner based on the state */}
              {isModalVisible ? (
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text style={{ fontFamily: "DMSansMedium" }}>
                    Scanned Product Code
                  </Text>
                </View>
              ) : (
                <Camera
                  onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                  style={{ flex: 1 }}
                >
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        setScanned(false);
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          color: "white",
                          width: 250,
                          height: 100,
                        }}
                      >
                        Reset Scan
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Camera>
              )}
            </Text>
          </View>
        </View>

        {/* Render the transaction details, item list, and total price */}
        <View style={{ height: "60%", width: "100%" }}>
          {/* Render input fields for transaction details */}
          {/* ... */}
          <View>
            <Text
              style={{
                marginTop: 5,
                marginBottom: 5,
                fontSize: 10,
                fontFamily: "DMSansRegular",
                textAlign: "center",
              }}
            >
              Search{" "}
            </Text>

            <View
              style={{
                position: "relative",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextInput
                style={{
                  fontSize: 16,
                  borderWidth: 1,
                  textAlign: "center",
                  width: "90%",
                }}
                placeholder="Enter Name or Product Code"
                onChangeText={(text) => setInputManual(text)}
                value={inputManual}
              />

              <View style={{ flex: 1, alignItems: "center", height: "100%" }}>
                {/* Other components below the FlatList */}
                {/* Add your other components here */}

                {/* Conditionally render the entire component */}
                {inputManual.length > 1 &&
                  suggestions.length > 0 &&
                  !suggestions.some((item) =>
                    selectedItems.some(
                      (selectedItem) => selectedItem.name === item.name
                    )
                  ) && (
                    <>
                      {/* Veil */}
                      <View
                        style={{
                          flex: 1,
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          zIndex: 2,
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                        }}
                      ></View>

                      {/* Suggestions FlatList */}
                      <View
                        style={{
                          borderWidth: 0.5,
                          width: "90%",
                          height: 200,
                          backgroundColor: "#fff",
                          justifyContent: "center",
                          alignItems: "center",
                          position: "absolute",
                          zIndex: 2,
                        }}
                      >
                        <FlatList
                          data={suggestions}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({ item }) => (
                            <View style={{ padding: 10 }}>
                              <TouchableOpacity
                                onPress={() => handleItemClick(item)}
                                style={{
                                  flexDirection: "row",
                                  marginLeft: 10,
                                  marginRight: 10,
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginTop: 8,
                                }}
                              >
                                <Text style={{ marginRight: 10 }}>
                                  {item.name}
                                </Text>
                                <Text>({item.code})</Text>
                              </TouchableOpacity>
                              {/* Render other properties as needed */}
                            </View>
                          )}
                          ItemSeparatorComponent={() => (
                            <View
                              style={{
                                borderBottomWidth: 1,
                                borderBottomColor: "#ccc",
                              }}
                            />
                          )}
                        />
                      </View>
                    </>
                  )}
              </View>
            </View>
            <View
              style={{
                width: "100%",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                flexDirection: "row",
                marginTop: 10,
              }}
            >
              <View>
                 {inventoryIsEmpty && (
        <Text style={{ fontFamily: "DMSansBold", fontSize: 10, bottom: 13, marginRight: 25, color: "red" }}>
          No Product in Inventory
        </Text>
      )}  
              </View>
            <TouchableOpacity
                title="Insert"
                style={{
                  padding: 10,
                  backgroundColor: "#ED254E",
                  width: 70,
                  borderRadius: 50,
                  marginRight: 5,
                  elevation: 5,
                  bottom: 2,
                }}
                onPress={handleAddTransactionItem}
              >
                <Text
                  style={{
                    fontFamily: "DMSansLight",
                    fontSize: 10,
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#f4fffd",
                  }}
                >
                  Insert
                </Text>
              </TouchableOpacity>
              {/* Button to insert selected items into the database */}
              <TouchableOpacity
                title="Pay"
                style={{
                  padding: 10,
                  backgroundColor: getBackgroundColor(),
                  width: 70,
                  borderRadius: 50,
                  marginRight: 25,
                  elevation: 5,
                  bottom: 2,
                }}
                onPress={() => {
                  openModal();
                }}
                disabled={selectedItems.length === 0 || inputQuantity === 0 || !isQuantityExceeded}
              >
                <Text
                  style={{
                    fontFamily: "DMSansLight",
                    fontSize: 10,
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#f4fffd",
                  }}
                >
                  Pay
                </Text>
              </TouchableOpacity>
            </View>
            {/* Render the list of selected items */}
            
            <View
              style={{
                backgroundColor: "#d9d9d9",
                height: "88%",
                width: "90%",
                alignSelf: "center",
                borderRadius: 10,
                top: 15,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  marginTop: 20,
                  right: 5,
                }}
              >
                <Text
                  style={{
                    fontFamily: "DMSansRegular",
                    fontSize: 12,
                    marginBottom: 5,
                    left: 5,
                  }}
                >
                  Name
                </Text>

                <Text
                  style={{
                    fontFamily: "DMSansRegular",
                    fontSize: 12,
                    left: 60,
                  }}
                >
                  Price
                </Text>

                <Text
                  style={{
                    fontFamily: "DMSansRegular",
                    fontSize: 12,
                    left: 35,
                  }}
                >
                  Quantity
                </Text>
                <Text
                  style={{
                    fontFamily: "DMSansRegular",
                    fontSize: 12,
                    marginBottom: 5,
                    left: 10,
                  }}
                >
                  Total
                </Text>
              </View>
             
              <FlatList
                style={{ margin: 0 }}
                data={selectedItems}
                keyExtractor={(item, index) => `${item.code}-${index}`} // Assuming each item has a unique code
                renderItem={({ item, index }) => (
                  <View
                    style={{
                      borderBottomWidth: 1,
                      padding: 10,
                      height: 50,
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => handleDeleteToggle(item.code)}
                        style={{ position: "absolute", left: 1 }}
                      >
                        <Image
                          source={require("./delete.png")}
                          style={{
                            height: 20,
                            width: 20,
                            shadowColor: "#d9d9d9",
                            shadowOffset: { width: 0, height: 0 },
                            shadowRadius: 5,
                          }}
                        ></Image>
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: 10,
                          textAlign: "left",
                          width: 100,
                          left: 30,
                          fontFamily: "DMSansBold",
                        }}
                      >
                        {item.name}{" "}
                        <Text style={{ fontSize: 9 }}>({item.code})</Text>
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          width: 80,
                          alignSelf: "flex-start",
                          textAlign: "center",
                          left: 33,
                          top: 7,
                        }}
                      >
                        {item.srp}
                      </Text>

                      <TextInput
                        style={{
                          fontFamily: "DMSansLight",
                          fontSize: 10,
                          width: 80,
                          alignSelf: "flex-start",
                          textAlign: "center",
                          left: 25,
                        }}
                        defaultValue="1"
                        placeholder="1"
                        keyboardType="numeric"
                        onChangeText={(text) => {
                          // Parse the input as an integer

                          // Parse the input as an integer
                          const numericValue = text.replace(/[^0-9.]/g, "");
                          const parsedQuantity = parseInt(text, 10);
                          // Update the quantity property for the specific item
                          const updatedItems = [...selectedItems];

                          if (numericValue === 0) {
                            setNegate(!isZero);
                          }
                          setInputQuantity(numericValue);
                          console.log(isQuantityExceeded < numericValue);
                          console.log("Inputed: ", inputQuantity);

                          const replacementOccurred = numericValue !== text;

                          // Check if the input is a non-empty integer
                          const isValidInput = /^[0-9]+(\.[0-9]*)?$/.test(
                            numericValue
                          );
                          // Update the button state
                          setIsButtonClickable(isValidInput);
                          console.log('Code Quantity:', item.code_quantity);
                          console.log('Product Quantity:', numericValue);
                          setIsQuantityExceeded(item.code_quantity > numericValue);
                          console.log("This is ", numericValue);
                          updatedItems[index] = {
                            ...item,
                            quantity: isNaN(numericValue) ? 0 : numericValue,
                            total_amount: isNaN(numericValue)
                              ? 0
                              : numericValue * item.srp, // Update total_amount
                          };
                          // Update the state with the updated items
                          setSelectedItems(updatedItems);
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 10,

                          alignSelf: "flex-start",
                          textAlign: "center",
                          left: 10,
                          top: 7,
                        }}
                      >
                      </Text>

                      <Text
                        style={{
                          fontSize: 10,
                          width: 80,
                          alignSelf: "flex-start",
                          textAlign: "center",
                          left: 10,
                          top: 7,
                        }}
                      >
                        P{" "}
                        {isNaN(item.total_amount)
                          ? 1 * item.srp
                          : item.total_amount}
                      </Text>
                    </View>
                  </View>
                )}
                ref={flatListRef}
              />
            </View>
          </View>
        </View>

        <SelectedItems selectedItems={selectedItems} />

        <Cart
          isVisiblePay={isCartModalVisible}
          closeModal={closeModal}
          updatedItems={updatedItems}
          selectedItems={selectedItems}
          totalSum={totalSum}
          handleInsertItemsToDatabase={handleInsertItemsToDatabase}
          totalamount={totalamount}
          handleValueChange={handleValueChange}
        />
      </View>
    </TouchableWithoutFeedback>
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

export default Scanner;
