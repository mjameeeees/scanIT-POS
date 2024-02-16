import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";

const Inventory = ({ navigation }) => {
  const Snacks = () => {
    navigation.navigate("Snacks");
  };

  const Beverages = () => {
    navigation.navigate("Beverages");
  };

  const Others = () => {
    navigation.navigate("Others");
  };

  const MultipleProducts = () => {
    navigation.navigate("MultipleProducts");
  };

  return (
    <View style={styles.scannerui}>
      <View style={styles.transactionboard}>
        <View style={{ position: "absolute", top: 15, left: 20 }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Dashboard");
            }}
            style={{ alignSelf: "flex-start" }}
          >
            <Image
              source={require("./back.png")}
              style={{
                height: 30,
                width: 30,
                shadowColor: "#d9d9d9",
                shadowOffset: { width: 0, height: 0 },
                shadowRadius: 5,
              }}
            ></Image>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontFamily: "DMSansBold",
            fontSize: 25,
            color: "white",
            textAlign: "right",
            justifyContent: "flex-end",
            marginRight: 25,
          }}
        >
          Inventory
        </Text>
      </View>
      <View>
        <View style={styles.buttonboard}>
          <TouchableOpacity style={styles.button} onPress={Snacks}>
            <Text style={styles.text}>Food</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={Beverages}>
            <Text style={styles.text}>Beverages</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={Others}>
            <Text style={styles.text}>Others</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={MultipleProducts}>
            <Text style={styles.text}>Multiple Products</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scannerui: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionboard: {
    width: "100%",
    height: 85,
    backgroundColor: "#011936",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  text: {
    textAlign: "center",
    color: "#000",
    fontFamily: "DMSansMedium",
    fontSize: 13,
  },
  buttonboard: {
    flex: 1,
    top: "5%",
    width: 900,
    justifyContent: "space-even",
    alignItems: "center",
  },
  button: {
    elevation: 5,
    backgroundColor: "#fff",
    width: "35%",
    height: "15%",
    borderRadius: 20,
    margin: 10,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Inventory;
