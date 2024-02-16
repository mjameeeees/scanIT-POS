import React, { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import {
  Modal,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Button,
} from "react-native";
import Receipt from "./receipt";
import { insertBestProduct } from "../../../integration/bestseller";
import { insertTransactionItems } from "../../../integration/transaction";
import { insertReport } from "../../../integration/report";
import Decimal from "decimal.js";

const Cart = ({
  
  isVisiblePay,
  closeModal,
  selectedItems,
  updatedItems,
  handleValueChange ,
  totalamount
}) => {

  const navigation = useNavigation();


  
  const handleNavigate = () => {
    
    navigation.navigate('Receipt');
    handleInsertItemsToDatabase();
  };
  

  const [purchaseDate, setPurchaseDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const flatListRef = React.useRef(null);
  const [changedValue, setChangedValue] = useState(0);
  const [totalamountValue, setTotalAmount] = useState(0);
   const totalCostSum = selectedItems.reduce((sum, item) => sum + item.quantity * item.cost, 0);

   const isPayButtonDisabled = totalSum > changedValue;
  const [totalSum, setTotalSum] = useState(0);

  // Calculate totalSum when selectedItems or changedValue changes
  useEffect(() => {
    const sum = selectedItems.reduce(
      (acc, item) => acc + item.quantity * item.srp,
      0
    );
    setTotalSum(sum);
  }, [selectedItems, changedValue]);

  // Calculate totalChange and limit to 2 decimal places
  const totalChange = (changedValue - totalSum).toFixed(2);


  const generateTransactionId = () => {
    const timestamp = new Date().getTime(); // Get the current timestamp
    const random = Math.floor(Math.random() * 100); // Generate a random number
    return `${timestamp}-${random}`;
  };
        const transactionid = generateTransactionId(); // Generate a new unique transaction ID
    
        const [receiptno, setNewReceiptNo] = useState(transactionid);
        const [currentTime, setCurrentTime] = useState(new Date());

        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const seconds = currentTime.getSeconds();
        const formattedTime = `${hours}:${minutes}:${seconds}`;


  const handleInsertItemsToDatabase = () => {
    console.log("Updated Items: ",updatedItems, changedValue)
    
    for (let i = 0; i < selectedItems.length; i++) {
      const currentDate = moment().format("YYYY-MM-DD");
      const item = updatedItems[i];


      if (item.name != null && item.quantity != null) {


        insertBestProduct(item.code, item.name,item.quantity, item.originalQuantity, item.unit,item.cost,item.srp,item.warnQuantity,item.expiryDate, item.location,item.purchaseDate,item.contact,item.category);

        // Insert the values into your function
        insertTransactionItems(
          receiptno,
          item.code,
          item.name,
          item.srp,
          item.quantity,
          item.srp * item.quantity,
          changedValue,
          totalSum,
          currentDate,
          formattedTime
        );

        const profit = totalSum - totalCostSum ;

        insertReport(
          currentDate,
          totalCostSum,
          totalSum,
          profit
        )
      }
      console.log("Handle Items",item);
      navigation.navigate('Receipt', {receiptno,selectedItems, changedValue,totalSum, currentDate, formattedTime});
    } 
;};
  

  return (
    <Modal visible={isVisiblePay} onRequestClose={closeModal}>
      <View style={{ backgroundColor: "#011936", padding: 10 }}>
        <Text
          style={{
            textAlign: "center",
            fontSize: 15,
            fontFamily: "DMSansBold",
            color: "#f4fffd",
          }}
        >
          Pay
        </Text>
      </View>

      <View
        style={{ justifyContent: "center", alignSelf: "center", width: 250 }}
      >
        <View style={{ marginTop: 50 }}>
          <Text
            style={{
              textAlign: "left",
              fontSize: 18,
              fontFamily: "DMSansBold",
            }}
          >
            Amount Payable
          </Text>
          <Text style={{ textAlign: "left", fontSize: 80, color: "#465362" }}>
            {totalSum}
          </Text>
        </View>
        <View>
          <Text
            style={{
              textAlign: "left",
              fontSize: 18,
              fontFamily: "DMSansBold",
            }}
          >
            Received
          </Text>
          <TextInput
            value={changedValue.toString()}
            onChangeText={(text) => setChangedValue(parseInt(text, 10) || 0)}
            style={{ fontSize: 80, color: "#750D37", borderWidth: 1 }}
            keyboardType="numeric"
          />
        </View>
        <View>
          <Text
            style={{
              textAlign: "left",
              fontSize: 18,
              fontFamily: "DMSansBold",
            }}
          >
            Change
          </Text>
          <Text style={{ textAlign: "left", fontSize: 80, color: "#011936" }}>
            {totalChange}
          </Text>
        </View>
      </View>

      <View
        style={{
          justifyContent: "flex-end",
          alignItems: "flex-end",
          right: 20,
          marginTop: 20,
          width: "100%",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          onPress={closeModal}
          style={{
            backgroundColor: "#ED254E",
            width: 100,
            height: 50,
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",
            elevation: 5,
            marginRight: 10,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: "DMSansBold",
              fontSize: 15,
              color: "#f4fffd",
            }}
          >
            Back
          </Text>
        </TouchableOpacity>

       
        <TouchableOpacity
      onPress={() => {
   
        handleInsertItemsToDatabase();
        
      }}
        style={{
            backgroundColor: isPayButtonDisabled ? "#ccc" : "#ED254E",
            width: 100,
            height: 50,
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",
            elevation: 5,
          }}
          disabled={isPayButtonDisabled}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: "DMSansBold",
              fontSize: 15,
              color: isPayButtonDisabled ? "#666" : "#f4fffd",
            }}
          >
            Pay
          </Text>
        </TouchableOpacity>
      </View>
        
    </Modal>

    
  );
};

export default Cart;
