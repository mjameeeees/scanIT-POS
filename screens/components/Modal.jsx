import React, { useState } from "react";
import { Modal, Button, View, Text } from "react-native";

const ModalComponent = () => {

  const [isVisible, setIsVisible] = useState(false);
  const toggleModal = () => {
    setIsVisible(!isVisible);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={toggleModal}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={{ backgroundColor: "white", padding: 20 }}>
          <Text>Are you sure you want to do this?</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
            <Button title="Yes" onPress={toggleModal} />
            <Button title="No" onPress={toggleModal} />
          </View>
        </View>
      </View>
    </Modal>
  );
};


export default ModalComponent;