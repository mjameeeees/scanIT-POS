import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { insertProduct } from '../../integration/insertproducts';
import { ToastAndroid } from 'react-native';

const InsertProducts = ({route , navigation}) => {

  
  const { 
       code,
        name,
        quantity,
        originalQuantity = quantity,
        unit,
        cost,
        srp,
        warnQuantity,
        expirydate,
        location,
        purchaseDate,
        contact,
        category
  } = route.params;
  const formattedExpiryDate = expirydate ? expirydate.toLocaleDateString() : '';
  const formattedCurrent = purchaseDate ? purchaseDate.toLocaleDateString() : '';


  const handleInsertData = async (text) => {
    console.log("Clicked");
    insertProduct(
      code,
      name,
      quantity,
      originalQuantity,
      unit,
      cost,
      srp,
      warnQuantity,
      formattedExpiryDate,
      location,
      formattedCurrent,
      contact,
      category)
    showToast();
    navigation.navigate("Inventory");
  };

  const back = () =>{
    navigation.goBack(); // Go back to the previous screen
  }

  const showToast = () => {
    ToastAndroid.show("New Product Inserted!", ToastAndroid.SHORT);
  };

return (
      <View>
         <View
              style={{
                width: "100%",
                height: 40,
                backgroundColor: "#011936",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "DMSansBold",
                  fontSize: 20,
                  color: "#fff",
                }}
              >
                Confirm
              </Text>
            </View>
            <View style={{ width: "100%", justifyContent: "center", alignItems: "center", marginTop:30 }}>
              <Text style={{ fontFamily: "DMSansBold" }}>Code:</Text>
              <Text style={{ fontFamily: "DMSansRegular", marginBottom: 15 }}>
                {code}
              </Text>
              <Text style={{ fontFamily: "DMSansBold" }}>Name:</Text>
              <Text
                style={{
                  fontFamily: "DMSansRegular",
                  marginBottom: 15,
                  fontSize: 15,
                }}
              >
                {name}
              </Text>
              <Text style={{ fontFamily: "DMSansBold" }}>Quantity:</Text>
              <Text
                style={{
                  fontFamily: "DMSansRegular",
                  marginBottom: 15,
                  fontSize: 15,
                }}
              >
                {quantity}
              </Text>
              <Text style={{ fontFamily: "DMSansBold" }}>Warning Level:</Text>
              <Text
                style={{
                  fontFamily: "DMSansRegular",
                  marginBottom: 15,
                  fontSize: 15,
                }}
              >
                {warnQuantity}
              </Text>
              <Text style={{ fontFamily: "DMSansBold" }}>Cost:</Text>
              <Text
                style={{
                  fontFamily: "DMSansRegular",
                  marginBottom: 15,
                  fontSize: 15,
                }}
              >
                {cost}
              </Text>
              <Text style={{ fontFamily: "DMSansBold" }}>SRP:</Text>
              <Text
                style={{
                  fontFamily: "DMSansRegular",
                  marginBottom: 15,
                  fontSize: 15,
                }}
              >
                {srp} per {unit}
              </Text>
              <Text style={{ fontFamily: "DMSansBold" }}>Expiry Date:</Text>
              <Text
                style={{
                  fontFamily: "DMSansRegular",
                  marginBottom: 15,
                  fontSize: 15,
                }}
              >
                {formattedExpiryDate}
              </Text>
              <Text style={{ fontFamily: "DMSansBold" }}>
                Purchase Location:
              </Text>
              <Text
                style={{
                  fontFamily: "DMSansRegular",
                  marginBottom: 15,
                  fontSize: 15,
                }}
              >
                {location}
              </Text>
              <Text style={{ fontFamily: "DMSansBold" }}>
                Supplier Contact:
              </Text>
              <Text
                style={{
                  fontFamily: "DMSansRegular",
                  marginBottom: 15,
                  fontSize: 15,
                }}
              >
                {contact}
              </Text>
              <Text style={{ fontFamily: "DMSansBold" }}>
                Date of Purchase:
              </Text>
              <Text
                style={{
                  fontFamily: "DMSansRegular",
               
                  fontSize: 15,
                }}
              >
                {formattedCurrent}
              </Text>
            </View>
            <View style={{flexDirection: "row", justifyContent: "center"}}>
              <TouchableOpacity
                onPress={back}
                style={{
                  padding: 10,
                  width: 130,
                  backgroundColor: "#ED254E",
                  borderRadius: 50,
                  alignSelf: "flex-end",
                  margin: 20,
                  elevation: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "DMSansBold",
                    textAlign: "center",
                    color: "#fff",
                  }}
                >
                  Back
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleInsertData}
                style={{
                  padding: 10,
                  width: 130,
                  backgroundColor: "#ED254E",
                  borderRadius: 50,
                  alignSelf: "flex-end",
                  margin: 20,
                  elevation: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "DMSansBold",
                    textAlign: "center",
                    color: "#fff",
                  }}
                >
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
      </View>
           
  )
}

export default InsertProducts;