import React, {memo} from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useState } from "react";
import moment from "moment";


const Sorting = ({ isVisible, onClose, data, sortByName, sortByExpiredDate, sortByQuantity, sortByPurchase, sortByUnit, sortBySRP, sortByLocation, sortByWarning }) => {


const [isVisibleSort, setIsVisibleSort] = useState(false);



    return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isVisible}
          onRequestClose={onClose}
        >
        <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                  <TouchableOpacity onPress={onClose} style={{alignSelf: "flex-end", marginBottom: 20}}>
                <Image
                source={require("./cancel.png")}
                style={{
                  height: 20,
                  width: 20,
                  shadowColor: "#d9d9d9",
                  shadowOffset: {width:0, height:0},
                  shadowRadius: 5
                }}
              ></Image></TouchableOpacity>
                    <Text style={{fontFamily: "DMSansBold"}}>Sort By</Text>
                    <View style={{width: 150}}>
                      <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                      <TouchableOpacity onPress={sortByName} style={{padding: 10, borderWidth:.5, margin:5}}><Text>Name</Text></TouchableOpacity>
                      <TouchableOpacity onPress={sortByExpiredDate} style={{padding: 10, borderWidth:.5}}><Text>Expired Date</Text></TouchableOpacity>
                      </View> 
                      <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                      <TouchableOpacity onPress={sortByQuantity} style={{padding: 10, borderWidth:.5, margin:5}}><Text>Quantity</Text></TouchableOpacity>
                      <TouchableOpacity onPress={sortByPurchase} style={{padding: 10, borderWidth:.5}}><Text>Date of Purchase</Text></TouchableOpacity>
                      </View> 
                      <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                      <TouchableOpacity onPress={sortByUnit} style={{padding: 10, borderWidth:.5, margin:5}}><Text>Unit</Text></TouchableOpacity>
                      <TouchableOpacity onPress={sortBySRP} style={{padding: 10, borderWidth:.5}}><Text>SRP</Text></TouchableOpacity>
                      </View> 
                      <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                      <TouchableOpacity onPress={sortByLocation} style={{padding: 10, borderWidth:.5, margin:5}}><Text>Purchase Location</Text></TouchableOpacity>
                      <TouchableOpacity onPress={sortByWarning} style={{padding: 10, borderWidth:.5}}><Text>Warning Level</Text></TouchableOpacity>
                      </View> 
                      
                    </View>
                   
                  </View>
                </View>
        </Modal>
      );
};

const styles = StyleSheet.create(
    {
        modalContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          modalContent: {
            width: 300, // Adjust the width as needed
            height: 400, // Adjust the height as needed
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            alignItems: "center"
          },
    }
)
export default memo(Sorting);
