import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput
} from "react-native";
import { useState, useEffect } from "react";
import moment from "moment";
import Sorting from "../components/sorting";
import { getExpiredProducts } from "../../integration/expiredproducts";
import { getProductsExpiringSoon,getOutOfStocksProducts, fetchOutOfStocksData  } from "../../integration/outofstocks";
import { getProductsExpiringIn7Days } from "../../integration/expiredproducts";
const Expired_products = ({ navigation }) => {
  const [isVisibleSort, setIsVisibleSort] = useState(false);

  const [products, setProducts] = useState([]);
  const [displayExpired, setDisplayExpired] = useState(false);


  const [modalVisible, setModalVisible] = useState(false);
  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };


  const sortByName = () => {
    const names = products.sort((a, b) => a.name.localeCompare(b.name));
    setProducts(names);
    setModalVisible(false);
}

const sortbyquantity = () => {
  const names = products.sort((a, b) => b.totalQuantity - a.totalQuantity);
  setProducts(names);
  setModalVisible(false);
}

const sortbywarninglevel = () => {
const names = products.sort((a, b) => b.warninglevel - a.warninglevel);
setProducts(names);
setModalVisible(false);
}

const sortbysrp = () => {
const names = products.sort((a, b) => b.srp - a.srp);
setProducts(names);
setModalVisible(false);
}

const sortbyunit = () => {
const snacksData = products.sort((a, b) => {
  if (a.unit === b.unit) {
    return a.name.localeCompare(b.name); // Sort by name within the same unit
  } else {
    return a.unit.localeCompare(b.unit); // Sort by unit if units are different
  }
});
setProducts(snacksData);
setModalVisible(false);
}

const sortbylocation = () => {
snacksData = products.sort((a, b) => {
  if (a.unit === b.unit) {
    return a.name.localeCompare(b.name); // Sort by name within the same location
  } else {
    return a.location.localeCompare(b.location); // Sort by location if location are different
  }
});
setProducts(snacksData);
setModalVisible(false);
}

const sortbypurchasedate = () => {
snacksData = products.sort((a, b) => moment(b.purchase_date).diff(moment(a.purchase_date)));  setIsVisibleSort(false);
setProducts(snacksData);
setModalVisible(false);
}

const sortbyexpireddate = () => {
snacksData = products.sort((a, b) => moment(b.expiry_date).diff(moment(a.expiry_date)));  setIsVisibleSort(false);
setProducts(snacksData);
setModalVisible(false);
}

const loss = products.reduce((sum, product) => sum + product.cost, 0);

  useEffect(() => {
    fetchData();
  }, [displayExpired]); // Re-run the effect when displayExpired changes

  const fetchData = async () => {
    try {
      let productsData = [];
  
      if (displayExpired) {
        productsData = [...productsData, ...await getExpiredProducts()];
        const totalCost = productsData.reduce((sum, product) => sum + product.cost, 0);

      } else {
        productsData = [...productsData, ...await getProductsExpiringSoon()];
      }
  
      setProducts(productsData);
  
    } catch (error) {
      console.error(`Error fetching ${displayExpired ? 'expired' : 'expiring'} products:`, error);
    }
  };



  const [expiringProducts, setExpiringProducts] = useState([]);



  console.log("Data in Perishables: ", expiringProducts);

  return (
    <View style={styles.scannerui}>
      <View style={styles.transactionboard}>
     
        <View
          style={{
            width: "100%",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            right:20
          }}
        >
          <Text
            style={{
              fontFamily: "DMSansBold",
              fontSize: 20,
              color: "white",
              
              textAlign: "right",
            }}
          >
            PERISHABLES
          </Text>
     
        </View>
      </View>

      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            margin: 10,
          }}
        >
          <Text style={{ fontFamily: "DMSansBold" }}>Sort By: </Text>
          <TouchableOpacity
            style={{
              padding: 5,
              backgroundColor: "#F9DC5C",
              borderRadius: 20,
              width: 100,
            }}
          >
            <Text
              onPress={handleOpenModal}
              style={{ textAlign: "center", fontFamily: "DMSansBold" }}
            >
              Date
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Text style={{ marginRight: 20, fontFamily: "DMSansBold" }}>
            Search:
          </Text>
          <TextInput style={{ borderWidth: 0.5, width: 250 }} />
        </View>
        <View style={{flexDirection: "row", justifyContent: "space-around", top:10}}>
          <TouchableOpacity onPress={() => setDisplayExpired(false)} style={{backgroundColor: "#D9D9D9",  justifyContent: "center", alignItems: "center", padding:10, borderRadius: 50, elevation: 5}}><Text style={{fontSize: 10, fontFamily: "DMSansBold"}}>7 Days Before Expiration Date</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setDisplayExpired(true)} style={{backgroundColor: "#D9D9D9",  justifyContent: "center", alignItems: "center", padding:10, borderRadius: 50, elevation: 5}}><Text style={{fontSize: 10, fontFamily: "DMSansBold"}}>Expired Products</Text></TouchableOpacity>
        </View>
          <View>
          {displayExpired && (
  <Text style={{ textAlign: "center",  marginTop: 20 }}>
    Total Loss: P {loss}
  </Text>
)}
          </View>
        <View
          style={{
            height: "75%",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10
          }}
        >
          <FlatList
            data={products}
            numColumns={1}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View
                style={{
                  elevation: 5,
                  margin: 10,
                  justifyContent: "center",
                  backgroundColor: "#D9D9D9",
                  padding: 20,
                  borderRadius: 20,
                  flexDirection: "column",
                }}
              >
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      margin: 5,
                    }}
                  >
                    <Text style={{ fontSize: 10, fontFamily: "DMSansBold" }}>
                      Code: {item.code}
                    </Text>
                   
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ justifyContent: "center", margin: 5 }}>
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: "DMSansMedium",
                          width: 130,
                          margin: 2,
                        }}
                      >
                        Name:{" "}
                        <Text style={{ fontFamily: "DMSansRegular" }}>
                          {item.name}
                        </Text>
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: "DMSansMedium",
                          width: 130,
                          margin: 2,
                        }}
                      >
                        Quantity:{" "}
                        <Text style={{ fontFamily: "DMSansRegular" }}>
                          {item.quantity}
                        </Text>
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: "DMSansMedium",
                          width: 130,
                          margin: 2,
                        }}
                      >
                        Cost:{" "}
                        <Text style={{ fontFamily: "DMSansRegular" }}>
                          {item.cost}
                        </Text>
                      </Text>
             
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: "DMSansMedium",
                          width: 130,
                          margin: 2,
                        }}
                      >
                        Purchase Location:{" "}
                        <Text style={{ fontFamily: "DMSansRegular" }}>
                          {item.price}
                        </Text>
                      </Text>
                    </View>
                    <View style={{ justifyContent: "center", margin: 5 }}>
                      <View>
                        <Text
                          style={{
                            fontSize: 10,
                            fontFamily: "DMSansMedium",
                            width: 130,
                            margin: 2,
                          }}
                        >
                          SRP:{" "}
                          <Text style={{ fontFamily: "DMSansRegular" }}>
                            {item.srp} per {item.unit}
                          </Text>
                        </Text>
                        <Text
                          style={{
                            fontSize: 10,
                            fontFamily: "DMSansMedium",
                            width: 130,
                            margin: 2,
                          }}
                        >
                          Expiry Date:{" "}
                          <Text style={{ fontFamily: "DMSansRegular" }}>
                            {item.expiry_date}
                          </Text>
                        </Text>
                        <Text
                          style={{
                            fontSize: 10,
                            fontFamily: "DMSansMedium",
                            width: 130,
                            margin: 2,
                          }}
                        >
                          Date of Purchase:{" "}
                          <Text style={{ fontFamily: "DMSansRegular" }}>
                            {item.expiry_date}
                          </Text>
                        </Text>
                        <Text
                          style={{
                            fontSize: 10,
                            fontFamily: "DMSansMedium",
                            width: 130,
                            margin: 2,
                          }}
                        >
                          Contact No:{" "}
                          <Text style={{ fontFamily: "DMSansRegular" }}>
                            {item.category}
                          </Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
         

              </View>
            )}
          />
        </View>
        <View>
        {modalVisible && (
        <Sorting
          data={products}
          sortByName={sortByName}
          sortByQuantity={sortbyquantity}
          sortByExpiredDate={sortbyexpireddate}
          sortByPurchase={sortbypurchasedate}
          sortByLocation={sortbylocation}
          sortBySRP={sortbysrp}
          sortByUnit={sortbyunit}
          sortByWarning={sortbywarninglevel}
          isVisible={modalVisible}
          onClose={handleCloseModal}
        >
          {/* Sorting component content */}
        </Sorting>
      )}
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
    height: 50,
    backgroundColor: "#011936",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    color: "#ffffff",
  },
  modalContainer: {
    flex: 1,
    opacity: 0.5,
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
  buttonboard: {
    marginBottom: 230,
  },
  button: {
    margin: 10,
    backgroundColor: "#B3DEC1",
    padding: 20,
  },
});

export default Expired_products;
