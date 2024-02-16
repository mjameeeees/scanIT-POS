import {
  Modal,
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from "react-native";
import { Image, Alert } from "react-native";
import { insertMultipleProducts } from "../../integration/insertproducts";
import moment from "moment";
import { useState } from "react";
import { useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { getAllProductCodes } from "../../integration/insertproducts";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera } from "expo-camera";

const MultipleProducts = ({ navigation }) => {
  const [code, setCode] = useState("Scan IT");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [originalQuantity, setOriginalQuantity] = useState(quantity);

  const [unit, setUnit] = useState("");
  const [cost, setCost] = useState("");
  const [srp, setSrp] = useState("");
  const [warnQuantity, setWarnQuantity] = useState("");
  const [productprice, setProductPrice] = useState("");
  const [expirydate, setExpirydate] = useState(new Date());
  const [location, setLocation] = useState("---");
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [contact, setContact] = useState("---");
  const [customCategory, setCustomCategory] = useState([
    "Snacks",
    "Beverages",
    "Others",
  ]);
  const [category, setCategory] = useState([]); // Initial predefined units

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isWithinOneWeek, setIsWithinOneWeek] = useState(false);

  const [addedUnits, setAddedUnits] = useState([]); // State to store added units
  const [allProducts, setAllProducts] = useState([]);
  const isCodePresent = allProducts.includes(code);

  const [measurement, setMeasurement] = useState("");

  const [isVisibleCategory, setIsVisibleCategory] = useState(false);

  const [isVisibleCart, setIsVisibleCart] = useState(false);
  const [isButtonClickable, setIsButtonClickable] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);

  const formattedExpiryDate =
    expirydate instanceof Date ? expirydate.toLocaleDateString() : "";
  const formattedCurrent =
    purchaseDate instanceof Date ? purchaseDate.toLocaleDateString() : "";

  const showStartDatePickerModal = () => {
    setShowStartDatePicker(true);
  };
  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    const currentDate = selectedDate || expirydate;

    setExpirydate(currentDate);
  };
  const [showStartDateCurrent, setShowStartDateCurrent] = useState(false);

  const showStartDatePickerCurrent = () => {
    setShowStartDateCurrent(true);
  };
  const handleStartDateCurrentChange = (event, selectedDate) => {
    setShowStartDateCurrent(false);
    const currentDate = selectedDate || purchaseDate;

    setPurchaseDate(currentDate);
  };
  useEffect(() => {
    // Calculate the difference between the current date and the expiration date
    const today = moment();
    const expirationMoment = moment(expirydate, "YYYY-MM-DD");
    const differenceInDays = expirationMoment.diff(today, "days");

    // Check if the expiration date is within one week
    setIsWithinOneWeek(differenceInDays <= 7);
  }, [expirydate]);

  //Setting Modal
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    addProduct();
  };

  useEffect(() => {
    // Fetch all product codes when the component mounts
    getAllProductCodes()
      .then((codes) => setAllProducts(codes))
      .catch((error) => console.error("Error fetching product codes: ", error));
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {

      try{
        if(!scanned){
       if (data) {
      // Product code is present
      setScanned(true);
      setCode(data);
      console.log("Type: " + type + "\nData: " + data);
  
      // Add your logic to handle the scanned product code
      // For example, you might want to fetch product details or perform other actions
     
  
      // Continue scanning if needed
      // You might want to clear the state or take other actions based on your requirements
      // setScanned(false);
      // setCode(null);
    } else {
      // No product code provided
      console.log("No product code provided.");
    }
    }
      } catch(error){
        console.error("Error fetching product details:", error);
        // Handle errors, e.g., display an error message to the user
      } finally{
        setScanned(false);
      }
    
    
   
  };

  const deleteItems = (items) => {
    const del = selectedProducts.filter((item) => item.code != items);
    setSelectedProducts(del);
  };

  const addProduct = () => {
    name &&
      console.log(
        code,
        name,
        quantity,
        unit,
        cost,
        srp,
        warnQuantity,
        formattedExpiryDate,
        location,
        formattedCurrent,
        contact,
        category
      );
    // Validate the input and create a new product object
    if (
      code &&
      name &&
      quantity &&
      unit &&
      cost &&
      srp &&
      warnQuantity &&
      formattedExpiryDate &&
      location &&
      formattedCurrent &&
      contact &&
      category
    ) {
      const newProduct = {
        code,
        name,
        quantity,
        unit,
        cost,
        srp,
        warnQuantity,
        formattedExpiryDate,
        location,
        formattedCurrent,
        contact,
        category,
      };
      setSelectedProducts([...selectedProducts, newProduct]);
      console.log(newProduct);
      console.log(selectedProducts);

      // Clear the input fields after adding a product
      setCode("");
      setName("");
      setQuantity("");
      setCost("");
      setSrp("");
      setWarnQuantity("");
      setLocation("---");
      setContact("--");
      setUnit("");
      setCategory("");
      setPurchaseDate(new Date());
      setExpirydate(new Date());
    }

    console.log(selectedProducts);
  };

  const addToCabinet = () => {
    // Check if there are products to add
    if (selectedProducts.length > 0) {
      const productsToAdd = selectedProducts.map((item) => [
        item.code,
        item.name,
        item.quantity,
        originalQuantity,
        item.unit,
        item.cost,
        item.srp,
        item.warnQuantity,
        item.formattedExpiryDate,
        item.location,
        item.formattedCurrent,
        item.contact,
        item.category,
      ]);
      console.log("Inserted Success");
      console.log(selectedProducts);
      // Call the insertMultipleProducts function to insert the selected products
      insertMultipleProducts(productsToAdd);

      // Clear the selected products after inserting
      setSelectedProducts([]);
    } else {
      // Handle the case where there are no products to add
      console.log("No products to add.");
    }
    navigation.navigate("Inventory");
  };

  const toggleVisibility = () => {
    setIsButtonClickable(!isButtonClickable);
  };
  const [choices, setChoices] = useState(["pcs", "ml", "kg", "oz"]); // Initial predefined units

  const [modalMeasurement, setModalMeasurement] = useState("");

  const handleSetMeasurement = () => {
    setMeasurement(modalMeasurement);
    setIsVisibleUnit(false);
  };

  const [items, setItems] = useState([
    { label: "Snacks", value: "Snacks", textStyle: { fontSize: 10 } },
    { label: "Beverages", value: "Beverages", textStyle: { fontSize: 10 } },
    { label: "Others", value: "Others", textStyle: { fontSize: 10 } },
  ]);

  const addProductsAndModal = () => {
    addProduct();
    toggleModal();
    console.log("New Product Insert");
  };

  const [customUnit, setCustomUnit] = useState("");

  const handleAddUnit = () => {
    if (customUnit.trim() !== "") {
      // Add the custom unit to the list of added units
      setAddedUnits((prevUnits) => [...prevUnits, customUnit]);
      // Add the custom unit to the choices
      setChoices((prevChoices) => [...prevChoices, customUnit]);
      AsyncStorage.setItem("choices", JSON.stringify(choices)).catch((error) =>
        console.error(error)
      );
      // Clear the custom unit input
      setCustomUnit("");
    }
  };

  const handleCustomUnitChange = (text) => {
    setCustomUnit(text);
    setUnit(null);
  };

  const [isVisibleUnit, setIsVisibleUnit] = useState(false);

  const handleDeleteUnit = (unitToDelete) => {
    setAddedUnits((prevUnits) =>
      prevUnits.filter((unit) => unit !== unitToDelete)
    );
    setChoices((prevChoices) =>
      prevChoices.filter((choice) => choice !== unitToDelete)
    );
  };

  const handleUnitSelection = (selectedUnit) => {
    setUnit(selectedUnit === "Custom" ? null : selectedUnit);
    setIsVisibleUnit(false);
  };

  const handleCategorySelection = (selectedUnit) => {
    setCategory(selectedUnit === "Custom" ? null : selectedUnit);
    setIsVisibleCategory(false);
  };
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const updateButtonStateQuantity = (value1, value2) => {
    const number1 = parseFloat(value1);
    const number2 = parseFloat(value2);

    // Check if value1 is greater than value2
    const isGreaterThan =
      !isNaN(number1) && !isNaN(number2) && number1 > number2;

    // Update the button state
    setIsButtonDisabled(isGreaterThan);
  };

  const updateButtonState = (value1, value2) => {
    const number1 = parseFloat(value1);
    const number2 = parseFloat(value2);

    // Check if value1 is greater than value2
    const isGreaterThan =
      !isNaN(number1) && !isNaN(number2) && number1 > number2;

    // Update the button state
    setIsButtonDisabled(isGreaterThan);
  };

  const handleInputQuantity = (text) => {
    // Remove non-numeric characters and update the input value
    const numericValue = text.replace(/[^0-9]/g, "");

    const replacementOccurred = numericValue !== text;

    setQuantity(numericValue);
    updateButtonStateQuantity(warnQuantity, text);

    // Check if the input is a non-empty integer
    const isValidInput = /^\d+$/.test(numericValue);

    if (replacementOccurred) {
      Alert.alert("Warning: ", "Only Numeric Character.");
    }

    // Update the button state
    setIsButtonClickable(isValidInput);
  };

  const handleInputWarning = (text) => {
    // Remove non-numeric characters and update the input value
    const numericValue = text.replace(/[^0-9]/g, "");
    console.log("Quantity Value ", text);
    const replacementOccurred = numericValue !== text;

    setWarnQuantity(numericValue);

    updateButtonStateQuantity(text, quantity);

    // Check if the input is a non-empty integer
    const isValidInput = /^\d+$/.test(numericValue);

    if (replacementOccurred) {
      Alert.alert("Warning: ", "Only Numeric Character.");
    }

    // Update the button state
    setIsButtonClickable(isValidInput);
  };

  const handleInputCost = (text) => {
    setCost(text);
    // Remove non-numeric characters and update the input value
    const numericValue = text.replace(/[^0-9.]/g, "");

    const replacementOccurred = numericValue !== text;

    setCost(numericValue);
    updateButtonState(text, productprice);

    // Check if the input is a non-empty integer
    const isValidInput = /^\d+$/.test(numericValue);

    if (replacementOccurred) {
      Alert.alert("Warning: ", "Only Numeric Character.");
    }

    // Update the button state
    setIsButtonClickable(isValidInput);
  };

  const handleInputSRP = (text) => {
    // Remove non-numeric characters and update the input value
    const numericValue = text.replace(/[^0-9.]/g, "");

    const replacementOccurred = numericValue !== text;

    setSrp(numericValue);

    updateButtonState(cost, text);
    // Check if the input is a non-empty integer
    const isValidInput = /^\d+$/.test(numericValue);

    if (replacementOccurred) {
      Alert.alert("Warning: ", "Only Numeric Character.");
    }

    // Update the button state
    setIsButtonClickable(isValidInput);
  };

  const handleInputExpiryDate = (text) => {
    // Remove non-numeric characters and update the input value
    const formattedDate = text.replace(/[^0-9]/g, "");

    // Format the date as "YYYY-MM-DD"
    const yyyy = formattedDate.slice(0, 4);
    const mm = formattedDate.slice(4, 6);
    const dd = formattedDate.slice(6, 8);

    const replacementOccurred = formattedDateString !== text;

    const validMonth = parseInt(mm, 10) >= 1 && parseInt(mm, 10) <= 12;

    // Ensure day is within the range 1 to 31
    const validDay =
      dd === "" || (parseInt(dd, 10) >= 1 && parseInt(dd, 10) <= 31);

    const formattedDateString = `${yyyy}-${mm}-${dd}`;

    // Check if the input is a non-empty integer

    // Update the button state

    setExpirydate(formattedDateString);
  };

  const handleInputContact = (text) => {
    // Remove non-numeric characters and update the input value
    const numericValue = text.replace(/[^0-9]/g, "");

    const replacementOccurred = numericValue !== text;

    setContact(numericValue);

    // Check if the input is a non-empty integer
    const isValidInput = /^\d+$/.test(numericValue);

    if (replacementOccurred) {
      Alert.alert("Warning: ", "Only Numeric Character.");
    }

    // Update the button state
    setIsButtonClickable(isValidInput);
  };

  const generateTransactionId = () => {
    const randomPart = Math.floor(10000 + Math.random() * 90000); // Generate a random number
    const productNumber = `SI${randomPart}`;
    setCode(productNumber);
    console.log(productNumber, "is your new Code");
  };

  

  return (
    <View style={styles.scannerui}>
      <View style={styles.transactionboard}>
        <Text
          style={{
            fontFamily: "DMSansBold",
            fontSize: 15,
            color: "white",
            textAlign: "center",
            alignSelf: "flex-end",
            marginRight: 20,
          }}
        >
          New Product
        </Text>
        <Text
          style={{
            fontFamily: "DMSansRegular",
            fontSize: 10,
            color: "white",
            textAlign: "right",
            alignSelf: "flex-end",
            marginRight: 20,
          }}
        >
          (Multiple Products)
        </Text>
      </View>
      <View
        style={{ justifyContent: "center", alignItems: "center", width: 200 }}
      >
        <View
          style={{
            justifyContent: "center",

            alignItems: "center",
            marginTop: 20,
            alignSelf: "center",
            height: 100,
            width: 250,
            overflow: "hidden",
          }}
        >
          <Text>
            <Camera
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={{ flex: 1 }}
            >
              <View style={styles.overlay}>
                <TouchableOpacity
                  style={styles.flipButton}
                  onPress={() => {
                    setScanned(false);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: "white",
                      width: 200,
                      height: 100,
                    }}
                  >
                    Reset Scan
                  </Text>
                </TouchableOpacity>
              </View>
            </Camera>
          </Text>
        </View>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            fontFamily: "DMSansRegular",
            fontSize: 13,
            textAlign: "center",
          }}
        >
          <Text style={styles.text}>Product Code: </Text>
          {code}
        </Text>

        <TouchableOpacity
          onPress={generateTransactionId}
          style={{ padding: 15 }}
        >
          <Image
            source={require("./redo.png")}
            style={{ width: 15, height: 15 }}
          />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <SafeAreaView
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: 300,
          }}
        >
          <Text style={styles.text}>Product Name</Text>
          <TextInput
            style={{
              fontSize: 15,
              textAlign: "center",
              height: 40,
              width: "100%",
              marginTop: 5,
              marginBottom: 5,
              borderWidth: 1,
              padding: 5,
              alignSelf: "flex-start",
            }}
            onChangeText={setName}
            value={name}
          />

          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            <View style={{ marginRight: 20 }}>
              <Text style={styles.text}>Quantity</Text>
              <TextInput
                style={{
                  fontSize: 15,
                  textAlign: "center",
                  height: 40,
                  width: 100,
                  marginTop: 5,
                  marginBottom: 5,
                  borderWidth: 1,
                  padding: 5,
                  alignSelf: "flex-start",
                }}
                onChangeText={handleInputQuantity}
                value={quantity}
                keyboardType="numeric"
              />
            </View>

            <View>
              <Text style={styles.text}>Unit</Text>
              <TouchableOpacity
                onPress={() => {
                  setIsVisibleUnit(true);
                }}
                style={{
                  fontSize: 15,
                  textAlign: "center",
                  height: 40,
                  width: 100,
                  marginTop: 5,
                  marginBottom: 5,
                  borderWidth: 1,
                  padding: 5,
                  alignSelf: "flex-start",
                }}
              >
                <Text>{unit}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            <View style={{ marginRight: 20 }}>
              <Text style={styles.text}>Cost</Text>
              <TextInput
                style={{
                  fontSize: 15,
                  textAlign: "center",
                  height: 40,
                  width: 100,
                  marginTop: 5,
                  marginBottom: 5,
                  borderWidth: 1,
                  padding: 5,
                  alignSelf: "flex-start",
                }}
                onChangeText={handleInputCost}
                value={cost}
                keyboardType="numeric"
              />
            </View>

            <View>
              <Text style={styles.text}>SRP</Text>
              <TextInput
                style={{
                  fontSize: 15,
                  textAlign: "center",
                  height: 40,
                  width: 100,
                  marginTop: 5,
                  marginBottom: 5,
                  borderWidth: 1,
                  padding: 5,
                  alignSelf: "flex-start",
                }}
                onChangeText={handleInputSRP}
                value={srp}
                keyboardType="numeric"
              />
            </View>
          </View>

          <Text style={styles.text}>Warning Level</Text>
          <TextInput
            style={{
              fontSize: 15,
              textAlign: "center",
              height: 40,
              width: "100%",
              marginTop: 5,
              marginBottom: 5,
              borderWidth: 1,
              padding: 5,
              alignSelf: "flex-start",
            }}
            onChangeText={handleInputWarning}
            value={warnQuantity}
            keyboardType="numeric"
          />

          <Text style={styles.text}>Expiry Date</Text>

          <Text
            style={{
              fontFamily: "DMSansLight",
              fontSize: 10,
              alignSelf: "flex-start",
            }}
          >
            (YYYY-MM-DD)
          </Text>
          <TouchableOpacity
            style={{
              fontSize: 15,
              textAlign: "center",
              height: 40,
              width: "100%",
              marginTop: 5,
              marginBottom: 5,
              borderWidth: 1,
              padding: 5,
              alignSelf: "flex-start",
            }}
            onPress={showStartDatePickerModal}
            placeholder="YYYY-MM-DD"
            onChangeText={handleInputExpiryDate}
            value={expirydate}
            keyboardType="numeric" // Set the keyboard type to numeric
          >
            {showStartDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={expirydate}
                mode="date"
                is24Hour={true}
                minimumDate={new Date()} // Set the minimum date to the current date
                onChange={handleStartDateChange}
                display="default"
              />
            )}
            {expirydate && (
              <Text
                style={{
                  fontFamily: "DMSansMedium",
                  textAlign: "center",
                  fontSize: 10,
                }}
              >
                {moment(expirydate).format("YYYY-MM-DD")}
              </Text>
            )}
          </TouchableOpacity>

          <Text style={styles.text}>Purchase Location</Text>
          <TextInput
            style={{
              fontSize: 15,
              textAlign: "center",
              height: 40,
              width: "100%",
              marginTop: 5,
              marginBottom: 5,
              borderWidth: 1,
              padding: 5,
              alignSelf: "flex-start",
            }}
            onChangeText={setLocation}
            value={location}
          />

          <Text style={styles.text}>Purchase Date</Text>
          <TouchableOpacity
            style={{
              fontSize: 15,
              textAlign: "center",
              height: 40,
              width: "100%",
              marginBottom: 5,
              marginTop: 5,
              borderWidth: 1,
              padding: 5,
              alignSelf: "flex-start",
            }}
            onPress={showStartDatePickerCurrent}
            placeholder="YYYY-MM-DD"
            onChangeText={handleStartDateCurrentChange}
            value={purchaseDate}
            keyboardType="numeric" // Set the keyboard type to numeric
          >
            {showStartDateCurrent && (
              <DateTimePicker
                testID="dateTimePicker"
                value={purchaseDate}
                mode="date"
                is24Hour={true}
                minimumDate={new Date()} // Set the minimum date to the current date
                onChange={handleStartDateCurrentChange}
                display="default"
              />
            )}
            {purchaseDate && (
              <Text
                style={{
                  fontFamily: "DMSansMedium",
                  textAlign: "center",
                  fontSize: 10,
                }}
              >
                {moment(purchaseDate).format("YYYY-MM-DD")}
              </Text>
            )}
          </TouchableOpacity>
          <Text style={styles.text}>Contact</Text>
          <TextInput
            style={{
              fontSize: 15,
              textAlign: "center",
              height: 40,
              width: "100%",
              marginTop: 5,
              marginBottom: 5,
              borderWidth: 1,
              padding: 5,
              alignSelf: "flex-start",
            }}
            onChangeText={setContact}
            value={contact}
          />

          <Text style={styles.text}>Category</Text>
          <TouchableOpacity
            style={{
              fontSize: 15,
              textAlign: "center",
              height: 40,
              width: "100%",
              marginTop: 5,
              marginBottom: 5,
              borderWidth: 1,
              padding: 5,
              alignSelf: "flex-start",
            }}
            onPress={() => {
              setIsVisibleCategory(true);
            }}
          >
            <Text>{category}</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
      <View
        style={{
          width: "100%",
          marginTop: 10,
          marginBottom: 10,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => setIsVisibleCart(true)}
          style={{ justifyContent: "center", marginRight: 10 }}
        >
          <Image
            source={require("./cart.png")}
            style={{
              height: 25,
              width: 25,
              shadowColor: "#d9d9d9",
              shadowOffset: { width: 0, height: 0 },
              shadowRadius: 5,
            }}
          ></Image>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignSelf: "center",
            padding: 10,
            width: 100,
            backgroundColor:
              isButtonDisabled ||
              cost == 0 ||
              srp == 0 ||
              quantity == 0 ||
              warnQuantity == 0 ||
              isCodePresent ||
              category == 0
                ? "#465362"
                : "#ED254E",
            borderRadius: 50,
            elevation: 4,
            margin: 5,
          }}
          title="Insert"
          onPress={addProduct}
          disabled={
            isButtonDisabled ||
            cost == 0 ||
            srp == 0 ||
            quantity == 0 ||
            warnQuantity == 0 ||
            isCodePresent ||
            category == 0
          }
        >
          <Text
            style={{
              fontFamily: "DMSansBold",
              fontSize: 10,
              textAlign: "center",
            }}
          >
            ADD TO CART
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignSelf: "center",
            padding: 10,
            width: 100,
            backgroundColor: selectedProducts == 0 ? "#ccc" : "#209116",
            borderRadius: 50,
            elevation: 4,
            margin: 5,
          }}
          title="Insert"
          onPress={addToCabinet}
          disabled={selectedProducts == 0}
        >
          <Text
            style={{
              fontFamily: "DMSansBold",
              fontSize: 10,
              textAlign: "center",
            }}
          >
            INSERT TO INVENTORY
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={isVisibleUnit}
        onRequestClose={() => setIsVisibleUnit(false)}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: "DMSansMedium",
                textAlign: "center",
                fontSize: 25,
                marginBottom: 20,
              }}
            >
              Unit
            </Text>
            {/* Unit selection buttons */}
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: 200,
              }}
            >
              {choices.map((unit) => (
                <TouchableOpacity
                  key={unit}
                  style={{
                    width: "90%",
                    height: 40,
                    backgroundColor:
                      selectedUnit === unit ? "blue" : "transparent",
                    margin: 5,
                    borderWidth: 0.5,
                    justifyContent: "space-around",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                  onPress={() => handleUnitSelection(unit)}
                >
                  <Text
                    style={{
                      fontFamily: "DMSansBold",
                      color: selectedUnit === unit ? "white" : "black",
                    }}
                  >
                    {unit}
                  </Text>
                  <TouchableOpacity
                    style={{ marginTop: 5 }}
                    onPress={() => handleDeleteUnit(unit)}
                  >
                    <Text>Delete</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom unit input */}

            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <TextInput
                style={{
                  alignSelf: "center",
                  textAlign: "center",
                  width: "90%",
                  height: 50,
                  margin: 5,
                  borderWidth: 0.5,
                }}
                placeholder="Enter Custom Unit"
                value={customUnit}
                onChangeText={handleCustomUnitChange}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: "#465362",
                  padding: 10,
                  borderRadius: 20,
                }}
                onPress={handleAddUnit}
              >
                <Text
                  style={{
                    fontFamily: "DMSansLight",
                    fontSize: 10,
                    color: "#fff",
                  }}
                >
                  ADD UNIT
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isVisibleCategory}
        onRequestClose={() => setIsVisibleCategory(false)}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: "DMSansMedium",
                textAlign: "center",
                fontSize: 25,
                marginBottom: 20,
              }}
            >
              Category
            </Text>
            {/* Unit selection buttons */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: 200,
                flexWrap: "wrap",
              }}
            >
              {Array.isArray(customCategory) &&
                customCategory.map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    style={{
                      width: 80,
                      height: 40,
                      backgroundColor:
                        selectedUnit === unit ? "blue" : "transparent",
                      margin: 5,
                      borderWidth: 0.5,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => handleCategorySelection(unit)}
                  >
                    <Text
                      style={{
                        fontFamily: "DMSansBold",
                        color: selectedUnit === unit ? "white" : "black",
                      }}
                    >
                      {unit}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isVisibleCart}
        onRequestClose={() => setIsVisibleCart(false)}
      >
        <View
          style={{
            width: "100%",
            height: 50,
            backgroundColor: "#011936",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{ fontFamily: "DMSansBold", fontSize: 20, color: "#fff" }}
          >
            Cart
          </Text>
        </View>

        <View
          style={{ width: "80%", alignSelf: "center", margin: "5%" }}
        ></View>
        <View>
          <FlatList
            data={selectedProducts}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "center",
                  backgroundColor: index % 2 === 0 ? "#f0f0f0" : "#ffffff",
                }}
              >
                <View style={{ flexDirection: "column" }}>
                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ alignItems: "center", marginRight: 30 }}>
                      <Text style={{ fontFamily: "DMSansBold", marginTop: 10 }}>
                        Code
                      </Text>
                      <Text
                        style={{ fontFamily: "DMSansRegular", fontSize: 13 }}
                      >
                        {item.code}
                      </Text>
                      <Text style={{ fontFamily: "DMSansBold", marginTop: 10 }}>
                        Name
                      </Text>
                      <Text
                        style={{ fontFamily: "DMSansRegular", fontSize: 13 }}
                      >
                        {item.name}
                      </Text>
                      <Text style={{ fontFamily: "DMSansBold", marginTop: 10 }}>
                        Category
                      </Text>
                      <Text
                        style={{ fontFamily: "DMSansRegular", fontSize: 13 }}
                      >
                        {item.category}
                      </Text>
                      <Text style={{ fontFamily: "DMSansBold", marginTop: 10 }}>
                        Quantity
                      </Text>
                      <Text
                        style={{ fontFamily: "DMSansRegular", fontSize: 13 }}
                      >
                        {item.quantity}
                      </Text>
                      <Text style={{ fontFamily: "DMSansBold", marginTop: 10 }}>
                        Unit
                      </Text>
                      <Text
                        style={{ fontFamily: "DMSansRegular", fontSize: 13 }}
                      >
                        {item.unit}
                      </Text>
                      <Text style={{ fontFamily: "DMSansBold", marginTop: 10 }}>
                        Warning Level
                      </Text>
                      <Text
                        style={{ fontFamily: "DMSansRegular", fontSize: 13 }}
                      >
                        {item.warnQuantity}
                      </Text>
                    </View>
                    <View style={{ alignItems: "center", marginLeft: 30 }}>
                      <Text style={{ fontFamily: "DMSansBold", marginTop: 10 }}>
                        Cost
                      </Text>
                      <Text
                        style={{ fontFamily: "DMSansRegular", fontSize: 13 }}
                      >
                        {item.cost}
                      </Text>
                      <Text style={{ fontFamily: "DMSansBold", marginTop: 10 }}>
                        SRP
                      </Text>
                      <Text
                        style={{ fontFamily: "DMSansRegular", fontSize: 13 }}
                      >
                        {item.srp}
                      </Text>
                      <Text style={{ fontFamily: "DMSansBold", marginTop: 10 }}>
                        Expiry Date
                      </Text>
                      <Text
                        style={{ fontFamily: "DMSansRegular", fontSize: 13 }}
                      >
                        {item.formattedExpiryDate}
                      </Text>
                      <Text style={{ fontFamily: "DMSansBold", marginTop: 10 }}>
                        Location
                      </Text>
                      <Text
                        style={{ fontFamily: "DMSansRegular", fontSize: 13 }}
                      >
                        {item.location}
                      </Text>
                      <Text style={{ fontFamily: "DMSansBold", marginTop: 10 }}>
                        Purchase Date
                      </Text>
                      <Text
                        style={{ fontFamily: "DMSansRegular", fontSize: 13 }}
                      >
                        {item.formattedCurrent}
                      </Text>
                      <Text style={{ fontFamily: "DMSansBold", marginTop: 10 }}>
                        Contact
                      </Text>
                      <Text
                        style={{ fontFamily: "DMSansRegular", fontSize: 13 }}
                      >
                        {item.contact}
                      </Text>
                    </View>
                    <Button title="Delete" onPress={()=>{deleteItems(item.code)}}></Button>
                  </View>
                  <View style={styles.horizontalLine} />
                </View>
              </View>
            )}
          />
        </View>
      </Modal>
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
    height: 50,
    backgroundColor: "#011936",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "DMSansBold",
    fontSize: 13,
    textAlign: "left",
    alignSelf: "flex-start",
  },
  inputdata: { width: "100%" },
  button: {
    alignItems: "center",

    backgroundColor: "#f05555",
    color: "#ffffff",
    padding: 15,
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,
    width: 300,
  },
  horizontalLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc", // You can customize the color
    marginVertical: 10, // Adjust the margin as needed
  },
});
export default MultipleProducts;
