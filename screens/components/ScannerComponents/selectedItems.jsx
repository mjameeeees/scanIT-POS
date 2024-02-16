import React from 'react'
import { useMemo,useState } from 'react'
import { Modal, View, Text, TouchableOpacity, FlatList } from 'react-native'

const SelectedItems = ({selectedItems}) => {

    const [isVisible, setIsVisible] = useState(false);

    const [isVisiblePay, setIsVisiblePay] = useState(false);
    const totalSum = useMemo(()=>selectedItems.reduce((sum, item) => sum + item.quantity * item.srp, 0),[selectedItems]) ;


  return (
    <Modal visible={isVisible} onRequestClose={() => setIsVisible(false)}>
        <View style={{ backgroundColor: "#011936", padding:10 }}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 15,
              fontFamily: "DMSansBold",
              color: "#f4fffd",
            }}
          >
            Confirm
          </Text>
        </View>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <TouchableOpacity onPress={()=>setIsVisible(false)} style={{backgroundColor:"#ED254E", elevation:5, padding: 10, margin:10, width: 80, borderRadius: 50}}>
            <Text style={{fontFamily: "DMSansBold", fontSize: 10, textAlign: "center", color: "#f4fffd"}}>
              BACK
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> {setIsVisiblePay(true)}} style={{backgroundColor:"#ED254E", elevation:5, padding: 10, margin:10, width: 80, borderRadius: 50}}>
          <Text style={{fontFamily: "DMSansBold", fontSize: 10, textAlign: "center", color: "#f4fffd"}}>
              DONE
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{justifyContent: "space-evenly", flexDirection: "row", margin: 5}}>
          <Text style={{fontFamily: "DMSansRegular", fontSize: 10}}>Name</Text>
          <Text style={{fontFamily: "DMSansRegular", fontSize: 10, left:15}}>Price</Text>
          <Text style={{fontFamily: "DMSansRegular", fontSize: 10, left:15}}>Quantity</Text>
          <Text style={{fontFamily: "DMSansRegular", fontSize: 10, left:15}} >Total Amount</Text>
        </View>
        

        <View style={{flexDirection: "row", width: "100%"}}>
        <View>
      {/* FlatList to display selectedItems */}
      <FlatList
        data={selectedItems}
        renderItem={({ item }) => (
          <View style={{width: 400, flexDirection: "row", left:10}}>
            <View style={{width: 90}}>
         <Text style={{fontFamily: "DMSansBold", fontSize: 10}}>{item.name}</Text>
          </View>
          <View style={{flexDirection: "row", justifyContent: "space-between", width: 150, left: 45, alignItems: "center"}}>
          <Text style={{fontFamily: "DMSansBold", fontSize: 10, right:10}}>{item.srp}</Text>
          <Text style={{fontFamily: "DMSansBold", fontSize: 10, left:5}}>{ item.quantity}</Text>
          <Text style={{fontFamily: "DMSansBold", fontSize: 10, textAlign: "center", left: 15}} >{ item.quantity * item.srp}</Text>
          </View>
          
          </View>
          
        )}
      />
    </View>
        </View>
        <View style={{alignSelf: "flex-end"}}><Text style={{fontFamily: "DMSansBold", fontSize: 10, textAlign: "center", marginRight:50, marginTop:10}} > <Text style={{fontFamily: "DMSansMedium"}}>Total Amount:  </Text> { totalSum}</Text></View>
        
      </Modal>
  )
}

export default SelectedItems