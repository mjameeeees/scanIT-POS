import React from 'react'
import { Modal, View, Button, Text } from 'react-native'
import { useNavigation } from "@react-navigation/native";
const ModalItems = ({ isVisible, onClose }) => {

    const navigations = useNavigation();

  return (
    
    <Modal
        transparent
        visible={isVisible}
        
        onRequestClose={() => onClose()}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '60%', justifyContent: "center" }}>
            <Text style={{fontFamily: "DMSansRegular", margin:5}}>Discard Transaction?</Text>
            <View style={{justifyContent: "space-between", height: 80}}>
              <Button title="Discard" color={'#ED254E'} onPress={() => {navigations.navigate("Dashboard") && onClose()}}  />
            <Button title="Cancel" onPress={() => onClose()} />
            </View>
            
          </View>
        </View>
      </Modal>

  )
}

export default ModalItems