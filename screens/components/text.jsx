import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const MyText = (props) => {
  return <MyText style={styles.text}>{props.text}</MyText>;
};

const styles = StyleSheet.create({
  boardtext: {
    fontFamily: "DMSansBold",
    fontSize: 30,
    color: "white",
    textAlign: "center",
    top: 20,
  },
  text: {
    color: "#fff",
    fontFamily: "DMSansBold",
  },
});

export default MyText;
