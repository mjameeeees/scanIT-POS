import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Button,
  TouchableOpacity,
} from "react-native";
import { deleteAll } from "./DatabaseHelper";

const Help = () => {
  const del = () => {
    deleteAll();
  };

  return (
    <View styles={styles.dashboardscreen}>
      <View style={styles.square}>
        <Text
          style={{
            fontFamily: "DMSansBold",
            fontSize: 20,
            color: "white",
            textAlign: "center",
            top: 20,
          }}
        >
          HELP
        </Text>
      </View>

      <SafeAreaView style={{ height: "88%" }}>
        <ScrollView style={{ paddingLeft: 50, paddingRight: 50 }}>
        
          <Text
            style={{
              fontFamily: "DMSansRegular",
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 20,
              marginTop: 25,
              marginBottom: 10
            }}
          >
            Dashboard
          </Text>
          <Text
            style={{
              fontFamily: "DMSansRegular",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Scanner Button
          </Text>
          <Text style={{textAlign: "justify"}}>
            The Scanner button is essential for enabling regular transactions.
            With this button's efficient and user-friendly design, users can
            quickly process things by scanning their barcodes. Its features
            greatly speed up the checkout process and enable precise and
            efficient product recording.
          </Text>
          <Text style={{textAlign: "justify"}}>-Select product by name or code to start transaction.</Text>
          <Text style={{textAlign: "justify"}}>
            After selecting product, insert in storage of selected products.
          </Text>
          <Text style={{textAlign: "justify"}}>
            You can change quantity by tapping quantity of your designated
            product item.
          </Text>
          <Text style={{textAlign: "justify"}}>
            The "Received Amount" input facilitates the determination of change
            by rapidly computing the difference and guaranteeing accurate
            transactions in retail and service settings.
          </Text>

          <Text style={{ fontWeight: "bold", textAlign: "center" }}>
            Notification Section
          </Text>
          <Text style={{textAlign: "justify"}}>
            The Notification Section is a dynamic component of the Point of Sale
            (POS) system, serving as an instant messenger for essential updates.
            Users are diligently informed about product expiration dates,
            top-selling items are highlighted, the need for restocking is
            indicated, and instances of out-of-stock products are flagged. It
            moreover provides informative reports.
          </Text>
          <Text style={{ fontWeight: "bold", textAlign: "center" }}>
            Perishables
          </Text>
          <Text style={{textAlign: "justify"}}>
            The button provides an immediate overview for timely inventory
            management, reduces waste, and guarantees product freshness in the
            Point of Sale system by combining expired products with those that
            are still within 7 days of expiration.
          </Text>
          <Text style={{ fontWeight: "bold", textAlign: "center" }}>
            Best Sellers
          </Text>
          <Text style={{textAlign: "justify"}}>
            The "Best Sellers" button functions as a shortcut to identify and
            prioritize top-performing products in the Point of Sale (POS)
            system. With the help of this button, users can quickly determine
            which products are the most popular with clients and rank them
            accordingly. This makes inventory management easier and guarantees
            that popular items are always in stock.
          </Text>
          <Text style={{ fontWeight: "bold", textAlign: "center" }}>
            Replenishment
          </Text>
          <Text style={{textAlign: "justify"}}>
            The "Replenishment" button serves as an easy way to find products
            that need to be restocked. By using this button, users can expedite
            the replenishment process by receiving an instant overview of the
            items that are running low on inventory.
          </Text>
          <Text style={{ fontWeight: "bold", textAlign: "center" }}>
            Security
          </Text>
          <Text style={{textAlign: "justify"}}>
            The "Security" button offers a safe place to download reports,
            product data, and receipts. This function is intended to guarantee
            restricted access to private information, enabling authorized staff
            members to obtain necessary data for record-keeping, auditing, or
            analysis.
          </Text>
          <Text style={{
              fontFamily: "DMSansRegular",
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 20,
              marginTop:25,
              padding: 10
            }}>
            Inventory
          </Text>
          <Text style={{textAlign: "justify"}}>Insert products and each details in this button.</Text>
          <Text style={{ fontWeight: "bold", textAlign: "center" }}>
            Sort By
          </Text>
          <Text style={{textAlign: "justify"}}>
            Sort by Name, Code, Quantity, Cost, SRP, Expiry Date, Date of
            Purchase, Warning Level, Purchase Location and Contact No. all list
            of products
          </Text>
          <Text style={{ fontWeight: "bold", textAlign: "center" }}>
            Add Product
          </Text>
          <Text style={{textAlign: "justify"}}>
            Insert all necessary data such as Product Code, Name, Quantity,
            Unit, Cost, SRP, Warning Level, Expiry Date, Purchase Location, and
            Contact
          </Text>
          <Text
            style={{
              fontFamily: "DMSansRegular",
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 20,
              marginTop:25, 
              padding: 10
            }}
          >
            Report
          </Text>
          <Text style={{textAlign: "justify"}}>
        These tools
            give useful insights for efficient business administration by
            providing the necessary data for monitoring inventories, transaction
            details, and sales performance.
          </Text>
          <Text style={{ fontWeight: "bold", textAlign: "center" }}>
            Receipts
          </Text>
          <Text style={{textAlign: "justify"}}>
            In the Point of Sale (POS) system, the Receipts area shows important
            information such as the receipt ID, product name, code, price,
            quantity, and grand total. Refunds are easily exported by users for
            easy record-keeping and analysis.
          </Text>
          <Text style={{ fontWeight: "bold", textAlign: "center" }}>
            Report (Daily, Weekly, Monthly)
          </Text>
          <Text style={{textAlign: "justify"}}>
            The Point of Sale (POS) system's Reports section displays crucial
            metrics including Net Sales, Total Cost, and Profit. Users don't
            need to make complicated decisions in order to export this data for
            simple record-keeping and analysis.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  dashboardscreen: {
    flex: 1,
    flexDirection: "column",
    height: "100%",
    width: "100%",
  },
  square: {
    width: "100%",
    height: 80,
    flexDirection: "column",
    backgroundColor: "#011936",
    alignContent: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "DMMono-Medium",
    color: "#f4fffd",
    textAlign: "center",
  },
});

export default Help;
