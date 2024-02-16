import React, { memo } from "react";
import {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  Button
} from "react-native";
import moment from "moment";
import { deleteItemById } from "../../integration/insertproducts";
import { fetchProducts } from "../../integration/insertproducts";
import { useState, useEffect } from "react";

import Sorting from "../components/sorting";

const Others = ({ navigation }) => {
  const Inventory = () => {
    navigation.navigate("Inventory");
  };

  const NewProductSnacks = () => {
    navigation.navigate("NewProductSnacks");
  };

  //Display from Database
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleData, setModalVisibleData] = useState(false);

  const [picked, setPicked] = useState(false);
  const [selectedName, setSelectedName] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("Name");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    console.log("refresh is Called");
    fetchProducts()
      .then((result) => {
        const snacksData = result
          .filter((product) => product.category === "Others")
          .reverse();
        setData(snacksData);
      })
      .catch((error) => console.error(error));
    console.log("Existing ", data);
  }, []);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  const filteredDatas = data.filter(item => item.name === selectedName);

  const seenNames = [];
const filteredData = data.filter((item) => {
  const lowerCaseQuery = searchQuery.toLowerCase();
  const lowerCaseName = item.name.toLowerCase();

  // Check if the name is already in seenNames array
  if (!seenNames.includes(lowerCaseName)) {
    seenNames.push(lowerCaseName); // Add the name to the seenNames array
    return (
      lowerCaseName.includes(lowerCaseQuery) ||
      item.code.toLowerCase().includes(lowerCaseQuery)
    );
  }

  return false; // Skip this item if the name has already been encountered
});

  const pageSize = 5; // Set your desired page size
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Get the items for the current page
  const itemsForCurrentPage = filteredData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handlePageClick = (page) => {
    setPicked(!picked);
    setCurrentPage(page);
  };

  const sortbyname = () => {
    data.sort((a, b) => a.name.localeCompare(b.name));
    setSort("Name");
    setModalVisible(false);
  };

  const sortbyquantity = () => {
    data.sort((a, b) => b.quantity - a.quantity);
    setSort("Quantity");
    setModalVisible(false);
  };

  const sortbywarninglevel = () => {
    data.sort((a, b) => b.warninglevel - a.warninglevel);
    setSort("Warning Level");
    setModalVisible(false);
  };

  const sortbysrp = () => {
    data.sort((a, b) => b.srp - a.srp);
    setSort("SRP");
    setModalVisible(false);
  };

  const sortbyunit = () => {
    snacksData = data.sort((a, b) => {
      if (a.unit === b.unit) {
        return a.name.localeCompare(b.name); // Sort by name within the same unit
      } else {
        return a.unit.localeCompare(b.unit); // Sort by unit if units are different
      }
    });
    setSort("Unit");
    setModalVisible(false);
  };

  const sortbylocation = () => {
    snacksData = data.sort((a, b) => {
      if (a.unit === b.unit) {
        return a.name.localeCompare(b.name); // Sort by name within the same location
      } else {
        return a.location.localeCompare(b.location); // Sort by location if location are different
      }
    });
    setSort("Location");
    setModalVisible(false);
  };

  const sortbypurchasedate = () => {
    const dateFormat = "DD/MM/YYYY";
    snacksData = data.sort((a, b) =>
      moment(b.purchase_date, dateFormat).diff(
        moment(a.purchase_date, dateFormat)
      )
    );
    setModalVisible(false);
    setSort("Date of Purchase");
    handleCloseModal();
  };

  const sortbyexpireddate = () => {
    snacksData = data.sort((a, b) => {
      const dateFormat = "DD/MM/YYYY";
      const expiryDateA = moment(a.expiry_date, dateFormat);
      const expiryDateB = moment(b.expiry_date, dateFormat);
      return expiryDateB.diff(expiryDateA);
    });
    setSort("Expiry Date");
    setModalVisible(false);
  };

  const [isVisible, setIsVisible] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState(null);

  //Delete Items
  const handleDeleteItem = async (indexToDelete) => {
    try {
      await deleteItemById(selectedProductId);
      Alert.alert("Success", "Item deleted successfully");
      setData((prevData) =>
        prevData.filter((item) => item.product_Id !== selectedProductId)
      );
    } catch (error) {
      Alert.alert("Error", "Failed to delete item");
    }
    setIsVisible(false);
  };

  const SortingMemo = React.memo(Sorting);

  return (
    <View style={styles.scannerui}>
      <View style={styles.transactionboard}>
        <View style={{ position: "absolute", top: 15, left: 20 }}>
          <TouchableOpacity
            onPress={Inventory}
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
        <TouchableOpacity
          style={{
            padding: 10,
            borderWidth: 0.5,
            margin: 15,
            top: 35,
            borderColor: "white",
            borderRadius: 10,
          }}
          onPress={NewProductSnacks}
        >
          <Text
            style={{
              fontFamily: "DMSansBold",
              fontSize: 10,
              color: "white",
              textAlign: "center",
            }}
          >
            ADD PRODUCT
          </Text>
        </TouchableOpacity>
        <View
          style={{
            justifyContent: "center",
            alignItems: "flex-end",
            margin: 15,
          }}
        >
          <Text
            style={{
              fontFamily: "DMSansBold",
              fontSize: 25,
              color: "white",
              textAlign: "right",
            }}
          >
            Inventory
          </Text>
          <Text
            style={{
              fontFamily: "DMSansBold",
              fontSize: 10,
              color: "white",
              textAlign: "center",
            }}
          >
            (Others)
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
              style={{
                textAlign: "center",
                fontFamily: "DMSansBold",
                fontSize: 10,
              }}
            >
              {sort}
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
          <TextInput
            value={searchQuery}
            onChangeText={handleSearch}
            style={{ borderWidth: 0.5, width: 250 }}
          />
        </View>
        <View
          style={{
            height: "80%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FlatList
            data={itemsForCurrentPage}
            numColumns={1}
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : index.toString()
            }
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
                  width: 250,
                }}
              >
                <TouchableOpacity onPress={()=>{setSelectedName(item.name) || setModalVisibleData(true)}}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        margin: 5,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "DMSansRegular",
                          textAlign: "center",
                        }}
                      >
                        {item.name}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleData}
            onRequestClose={() => setModalVisibleData(!modalVisibleData)}
          >
            <View style={{ width: "100%", height: "90%", justifyContent: "center", alignItems: "center", top:120,marginBottom:40,backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
              <Button title="Close" onPress={()=>{setModalVisibleData(false)}}>Close</Button>
              <FlatList
            data={filteredDatas}
            numColumns={1}
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : index.toString()
            }
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
                <TouchableOpacity>
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
                    <TouchableOpacity
                      style={{ elevation: 10 }}
                      onPress={() => {
                        setSelectedProductId(item.product_Id);
                        setIsVisible(true);
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "DMSansBold",
                          width: 80,
                          borderRadius: 20,
                          fontSize: 10,
                          padding: 5,
                          backgroundColor: "#465362",
                          justifyContent: "center",
                          textAlign: "center",
                          color: "#fff",
                        }}
                      >
                        Delete
                      </Text>
                    </TouchableOpacity>
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
                          {item.quantity} ({item.original_quantity})
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
                        Warning Level:{" "}
                        <Text style={{ fontFamily: "DMSansRegular" }}>
                          {item.warninglevel}
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
                          {item.location}
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
                            {item.purchase_date}
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
                            {item.contact}
                          </Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>

                <Modal
                  visible={isVisible}
                  onRequestClose={() => setIsVisible(false)}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      height: 500,
                    }}
                  >
                    <View>
                      <Text style={{ textAlign: "center" }}>
                        Are you sure??{" "}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-around",
                        }}
                      >
                        <TouchableOpacity
                          onPress={handleDeleteItem}
                          style={{
                            width: 80,
                            height: 40,
                            backgroundColor: "#465362",
                            margin: 5,
                            borderRadius: 50,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{ fontFamily: "DMSansBold", color: "#fff" }}
                          >
                            Yes
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            setIsVisible(false);
                          }}
                          style={{
                            width: 80,
                            height: 40,
                            backgroundColor: "#465362",
                            margin: 5,
                            borderRadius: 50,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{ fontFamily: "DMSansBold", color: "#fff" }}
                          >
                            No
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
            )}
          />
            </View>
            
          </Modal>

          <View>
            {modalVisible && (
              <Sorting
                data={data}
                sortByName={sortbyname}
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
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "#000",
              width: "90%", // Adjust the width of the line based on your design
              marginLeft: 5, // Adjust the margin based on your design
            }}
          />
          <View
            style={{ flexDirection: "row", marginTop: 10, borderRadius: 200 }}
          >
            {Array.from({ length: totalPages }, (_, index) => (
              <TouchableOpacity
                key={index + 1}
                onPress={() => handlePageClick(index + 1)}
                style={{
                  padding: 8,
                  margin: 5,
                  backgroundColor: picked ? "transparent" : "transparent",
                  borderWidth: picked ? 1 : 0, // Add a border only when picked is true
                  borderColor: "#000", // Color of the border
                  borderRadius: 8, // Optional: Border radius for rounded corners
                }}
              >
                <Text style={{ color: "#000", fontSize: 12 }}>{index + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
    height: 120,
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
    alignItems: "center",
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

export default Others;
