import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";

const Salestracker = ({ navigation }) => {
  const Dashboard = () => {
    navigation.navigate("Dashboard");
  };
  const DailyTracker = () => {
    navigation.navigate("DailyTracker");
  };
  const MonthlyTracker = () => {
    navigation.navigate("MonthlyTracker");
  };
  const AllRecords = () => {
    navigation.navigate("AllRecords");
  };

  const Overall = () => {
    navigation.navigate("MonthlyProfit");
  };

  const Transaction = () => {
    navigation.navigate("Transaction");
  };

  return (
    <View style={styles.scannerui}>
      <View style={styles.transactionboard}>
        <Text
          style={{
            fontFamily: "DMSansBold",
            fontSize: 25,
            color: "white",
            textAlign: "center",
            marginRight: 25,
          }}
        >
          Report
        </Text>
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View>
          <TouchableOpacity
            style={{
              padding: 50,
              backgroundColor: "#f4fffd",
              margin: 10,
              borderRadius: 20,
              elevation: 5,
            }}
            onPress={Overall}
          >
            <Text style={styles.text}>Product Inventory</Text>
          </TouchableOpacity>
          <View style={{ justifyContent: "space-between" }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                style={{
                  elevation: 5,
                  width: "45%",
                  height: 130,
                  backgroundColor: "#f4fffd",
                  borderRadius: 20,
                  justifyContent: "center",
                  margin: 5,
                }}
                onPress={Transaction}
              >
                <Text style={styles.text}>Receipts</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  elevation: 5,
                  margin: 5,
                  width: "45%",
                  height: 130,
                  backgroundColor: "#f4fffd",
                  borderRadius: 20,
                  justifyContent: "center",
                }}
                onPress={DailyTracker}
              >
                <Text style={styles.text}>Daily Report</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                style={{
                  elevation: 5,
                  width: "45%",
                  height: 130,
                  backgroundColor: "#f4fffd",
                  borderRadius: 20,
                  justifyContent: "center",
                  margin: 5,
                }}
                onPress={AllRecords}
              >
                <Text style={styles.text}>Weekly Report</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  elevation: 5,
                  width: "45%",
                  height: 130,
                  backgroundColor: "#f4fffd",
                  borderRadius: 20,
                  justifyContent: "center",
                  margin: 5,
                }}
                onPress={MonthlyTracker}
              >
                <Text style={styles.text}>Monthly Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scannerui: {
    height: "100%",
  },
  transactionboard: {
    width: "100%",
    height: 50,
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
    top: "5%",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    elevation: 5,
    width: 300,
    height: "35%",
    backgroundColor: "#f4fffd",
    borderRadius: 20,
    justifyContent: "center",
  },
  button_row: {
    elevation: 5,
    width: "18%",
    height: "55%",
    backgroundColor: "#f4fffd",
    borderRadius: 20,
    justifyContent: "center",
  },
});

export default Salestracker;
