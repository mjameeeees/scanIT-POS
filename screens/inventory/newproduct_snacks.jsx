import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Button,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Image } from "react-native";
import React from "react";
import { ToastAndroid } from "react-native";

import moment from "moment"; // Import the moment 
import { useState, useEffect } from "react";
import { getAllProductCodes } from "../../integration/insertproducts";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Camera } from 'expo-camera';

import {
  InsertNewProductTable,
  insertProduct,
} from "../../integration/insertproducts";

const NewProductSnacks = ({ navigation }) => {
  //Handle Data
  const [code, setCode] = useState("Scan It");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [originalQuantity, setOriginalQuantity] = useState("");

  const [unit, setUnit] = useState("");
  const [cost, setCost] = useState("");
  const [srp, setSrp] = useState("");
  const [warnQuantity, setWarnQuantity] = useState("");
  const [productprice, setProductPrice] = useState("");
  const [expirydate, setExpirydate] = useState(new Date());
  const [location, setLocation] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [contact, setContact] = useState("");
  const [category, setCategory] = useState("Snacks");

  const [isVisibleUnit, setIsVisibleUnit] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  const [customUnit, setCustomUnit] = useState('');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [choices, setChoices] = useState(['pcs', 'ml', 'kg', 'oz']); // Initial predefined units
  const [addedUnits, setAddedUnits] = useState([]); // State to store added units
  const [isWithinOneWeek, setIsWithinOneWeek] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());


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
    const expirationMoment = moment(expirydate, 'YYYY-MM-DD');
    const differenceInDays = expirationMoment.diff(today, 'days');

    // Check if the expiration date is within one week
    setIsWithinOneWeek(differenceInDays <= 7);
  }, [expirydate]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const productCodes = await getAllProductCodes();
        setAllProducts(productCodes);
      } catch (error) {
        console.error('Error getting product codes:', error);
      }
    };

    fetchData();
  }, []);


 useEffect(() => {
    const loadAddedUnits = async () => {
      try {
        const storedUnits = await AsyncStorage.getItem('addedUnits');
        if (storedUnits) {
          setAddedUnits(JSON.parse(storedUnits));
          setChoices((prevChoices) => [...prevChoices, ...JSON.parse(storedUnits)]);
        }
      } catch (error) {
        console.error('Error loading added units:', error);
      }
    };

    loadAddedUnits();
    
  }, []);

  // Save added units to AsyncStorage whenever it changes
  useEffect(() => {
    const saveAddedUnits = async () => {
      try {
        await AsyncStorage.setItem('addedUnits', JSON.stringify(addedUnits));
      } catch (error) {
        console.error('Error saving added units:', error);
      }
    };

    saveAddedUnits();
  }, [addedUnits]);
   

  const handleAddUnit = () => {
    if (customUnit.trim() !== '') {
      // Add the custom unit to the list of added units
      setAddedUnits((prevUnits) => [...prevUnits, customUnit]);
      // Add the custom unit to the choices
      setChoices((prevChoices) => [...prevChoices, customUnit]);
      AsyncStorage.setItem('choices', JSON.stringify(choices))
      .catch((error) => console.error(error));
      // Clear the custom unit input
      setCustomUnit('');
      
    }
  };

 

  const handleUnitSelection = (selectedUnit) => {
    setUnit(selectedUnit === 'Custom' ? null : selectedUnit);
    setIsVisibleUnit(false);
  };

  const handleCustomUnitChange = (text) => {
    setCustomUnit(text);
    setUnit(null);
  };


  const handleDeleteUnit = (unitToDelete) => {
    setAddedUnits((prevUnits) => prevUnits.filter((unit) => unit !== unitToDelete));
    setChoices((prevChoices) => prevChoices.filter((choice) => choice !== unitToDelete));
  };
  const [isButtonClickable, setIsButtonClickable] = useState(false);

  const isCodePresent = allProducts.includes(code);

  const [modalMeasurement, setModalMeasurement] = useState("");

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleInsertData = async (text) => {
    console.log("Clicked");
    setOriginalQuantity(quantity);

    try {
      // Example product details
      const product = {
        code,
        name,
        quantity,
        originalQuantity,
        unit,
        cost,
        srp,
        warnQuantity,
        expirydate,
        location,
        purchaseDate,
        contact,
        category,
      };

      const insertedProductId = await insertProduct(...Object.values(product));
      console.log(`Product inserted with ID: ${insertedProductId}`);
    } catch (error) {
      console.error("Error inserting product:", error);
    }

    showToast();

    navigation.navigate("Inventory");
    setIsVisible(false);
  };

 

  //For Camera Scanner
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState("");

  // Request Camera Permission
  const askForCameraPermission = () => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  };

  // Request Camera Permission
  useEffect(() => {
    askForCameraPermission();
  }, []);

  // What happens when we scan the bar code
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setCode(data);
    console.log("Type: " + type + "\nData: " + data);
  };

  const showToast = () => {
    ToastAndroid.show("New Product Inserted!", ToastAndroid.SHORT);
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
    const productNumber = `PR${randomPart}`;
    setCode(productNumber);
    console.log(productNumber, "is your new Code");
  };

  const handleSetMeasurement = () => {
    setUnit(modalMeasurement);
    setIsVisible(false);
  };


  const [isModalVisible, setModalVisible] = useState(false);
  const [otherValue, setOtherValue] = useState("");

  const updateButtonState = (value1, value2) => {
    const number1 = parseFloat(value1);
    const number2 = parseFloat(value2);

    // Check if value1 is greater than value2
    const isGreaterThan =
      !isNaN(number1) && !isNaN(number2) && number1 > number2;

    // Update the button state
    setIsButtonDisabled(isGreaterThan);
  };

  const updateButtonStateQuantity = (value1, value2) => {
    const number1 = parseFloat(value1);
    const number2 = parseFloat(value2);

    // Check if value1 is greater than value2
    const isGreaterThan =
      !isNaN(number1) && !isNaN(number2) && number1 > number2;

    // Update the button state
    setIsButtonDisabled(isGreaterThan);
  };

  const insertProducts = () => {
    handleInsertData();
    navigation.navigate("Snacks");
    setIsVisible(false);
  };

  const navigateToInsertScreen = () => {
    navigation.navigate ('InsertProducts',{
      code,
        name,
        quantity,
        originalQuantity,
        unit,
        cost,
        srp,
        warnQuantity,
        expirydate,
        location,
        purchaseDate,
        contact,
        category
    }
    )
  }

  //Screen for New Product

  return (
    <View style={styles.scannerui}>
      <View style={styles.transactionboard}>
      <View style={{position: "absolute", top: 15,left:20}}>
      <TouchableOpacity onPress={()=>{navigation.navigate('Inventory')}} style={{alignSelf: "flex-start"}}><Image
                source={require("./back.png")}
                style={{
                  height: 20,
                  width: 20,
                  shadowColor: "#d9d9d9",
                  shadowOffset: {width:0, height:0},
                  shadowRadius: 5
                }}
              ></Image>
              </TouchableOpacity>
      </View>
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
          (Snacks)
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
        style={{ flex: 1}}>
        <View style={{width:190}}>
          <TouchableOpacity
            
            onPress={() => {
              setScanned(false);
            }}>
            <Text style={{ height: 100, width:190,fontSize: 18, color: 'white' }}>Reset Scan</Text>
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
            width: 300
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
            keyboardType="numeric"
            onChangeText={handleInputWarning}
            value={warnQuantity}
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
              marginBottom: 5,
              marginTop: 5,
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
            <Text style={{ fontFamily: 'DMSansMedium', textAlign: 'center', fontSize: 10 }}>
              {moment(expirydate).format('YYYY-MM-DD')}
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
            <Text style={{ fontFamily: 'DMSansMedium', textAlign: 'center', fontSize: 10 }}>
              {moment(purchaseDate).format('YYYY-MM-DD')}
            </Text>
          )}
          </TouchableOpacity>

          <Text style={styles.text}>Contact No.</Text>
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
            onChangeText={handleInputContact}
            value={contact}
            keyboardType="numeric"
          />
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
                <Text style={{ fontFamily: "DMSansMedium", textAlign: "center", fontSize: 25, marginBottom:20 }}>Unit</Text>
            {/* Unit selection buttons */}
        <View style={{justifyContent: "center", alignItems: "center", width: 200 }}>
        {choices.map((unit) => (
          <TouchableOpacity
            key={unit}
            style={{
              width: "90%",
              height: 40,
              backgroundColor: selectedUnit === unit ? 'blue' : 'transparent',
              margin: 5,
              borderWidth: 0.5,
              justifyContent: "space-around",
              alignItems: "center",
              flexDirection:"row"
            }}
            onPress={() => handleUnitSelection(unit)}
          >
            <Text style={{ fontFamily: "DMSansBold", color: selectedUnit === unit ? 'white' : 'black' }}>
              {unit}
            </Text>
            <TouchableOpacity style={{marginTop:5}} onPress={() => handleDeleteUnit(unit)}>
              <Text>Delete</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
        
      </View>

      {/* Custom unit input */}
   
        <View style={{  justifyContent: "center", alignItems: "center" }}>
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
          <TouchableOpacity style={{backgroundColor: "#465362", padding:10, borderRadius:20}} onPress={handleAddUnit}><Text style={{fontFamily: "DMSansLight", fontSize: 10, color: "#fff"}}>ADD UNIT</Text></TouchableOpacity>
        </View>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </ScrollView>
      <View style={{  height:"10%", width: "100%" }}>
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignSelf: "center",
            top: 10,
            padding: 15,
            width: "90%",
            backgroundColor: 
            isButtonDisabled ||
            cost == 0 ||
            srp == 0 ||
            quantity == 0 ||
            warnQuantity == 0 ||
            isCodePresent
        ? '#465362'  // Set the background color for disabled state
        : '#ED254E', 
            borderRadius: 5,
            elevation: 4,
          }}
          title="Insert"
          onPress={navigateToInsertScreen}
          disabled={
            isButtonDisabled ||
            cost == 0 ||
            srp == 0 ||
            quantity == 0 ||
            warnQuantity == 0 ||
            isCodePresent
          }
        >
          <Text
            style={{
              fontFamily: "DMSansMedium",
              fontSize: 15,
              textAlign: "center",
              color: "#fff"
            }}
          >
            Insert
          </Text>
        </TouchableOpacity>
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
    height: 50,
    backgroundColor: "#011936",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "DMSansMedium",
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
});

export default NewProductSnacks;
