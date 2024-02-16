import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { useState, useEffect } from "react";
import {

  getVoidReceipts,
} from "../../integration/void_receipts";
import { getOutOfStocksProducts } from "../../integration/outofstocks";
import {
 
  useIsFocused,
} from "@react-navigation/native";
import Sorting from "../components/sorting";

const Archive = ({ navigation }) => {
  const [bestProducts, setBestProducts] = useState([]);
  const [error, setError] = useState(null);
  const [activeScreen, setActiveScreen] = useState("VoidReceipts");

  const isFocused = useIsFocused();
  const [reversedArrayPages, setReversedArrayPages] = useState([]);
  const [isVisibleSort, setIsVisibleSort] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const data = [...reversedArrayPages].reverse();
  const [outOfStocksProducts, setOutOfStocksProducts] = useState([]);
  const [voidReceipts, setVoidReceipts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
    const [picked, setPicked] = useState(false);
  const [isSortingVisible, setIsSortingVisible] = useState(true);
    
  const handlePageClick = (page) => {
    setPicked(!picked);
    setCurrentPage(page);
  };
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredData = outOfStocksProducts.filter((item) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(lowerCaseQuery) ||
      item.code.toLowerCase().includes(lowerCaseQuery)
    );
  });  

    
  const pageSize = 5; // Set your desired page size
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const itemsForCurrentPage = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / pageSize);

 
  const handleSortButton = () => {
    setIsSortingVisible(!isSortingVisible);
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const sortByName = () => {
    const names = outOfStocksProducts.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setOutOfStocksProducts(names);
  };

  const sortbyquantity = () => {
    const names = outOfStocksProducts.sort(
      (a, b) => b.totalQuantity - a.totalQuantity
    );
    setOutOfStocksProducts(names);
  };

  const sortbywarninglevel = () => {
    const names = outOfStocksProducts.sort(
      (a, b) => b.warninglevel - a.warninglevel
    );
    setOutOfStocksProducts(names);
  };

  const sortbysrp = () => {
    const names = outOfStocksProducts.sort((a, b) => b.srp - a.srp);
    setOutOfStocksProducts(names);
  };

  const sortbyunit = () => {
    const snacksData = outOfStocksProducts.sort((a, b) => {
      if (a.unit === b.unit) {
        return a.name.localeCompare(b.name); // Sort by name within the same unit
      } else {
        return a.unit.localeCompare(b.unit); // Sort by unit if units are different
      }
    });
    setOutOfStocksProducts(snacksData);
  };

  const sortbylocation = () => {
    snacksData = outOfStocksProducts.sort((a, b) => {
      if (a.unit === b.unit) {
        return a.name.localeCompare(b.name); // Sort by name within the same location
      } else {
        return a.location.localeCompare(b.location); // Sort by location if location are different
      }
    });
    setOutOfStocksProducts(snacksData);
  };

  const sortbypurchasedate = () => {
    snacksData = outOfStocksProducts.sort((a, b) =>
      moment(b.purchase_date).diff(moment(a.purchase_date))
    );
    setIsVisibleSort(false);
    setOutOfStocksProducts(snacksData);
  };

  const sortbyexpireddate = () => {
    snacksData = outOfStocksProducts.sort((a, b) =>
      moment(b.expiry_date).diff(moment(a.expiry_date))
    );
    setIsVisibleSort(false);
    setOutOfStocksProducts(snacksData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await getOutOfStocksProducts();
        setOutOfStocksProducts(products);

        // Log the out-of-stock products in the console
        console.log("Out-of-Stock Products:", products);
      } catch (error) {
        console.error("Error fetching out-of-stock products:", error);
      }
    };

    fetchData();
  }, []); // Run only on mount

  useEffect(() => {
    fetchVoidReceipts();
  }, []);

  const fetchVoidReceipts = async () => {
    try {
      const receipts = await getVoidReceipts();
      setVoidReceipts(receipts);
    } catch (error) {
      console.error("Error fetching void receipts:", error);
    }
  };

  const handleOutofStocksPress = () => {
    setActiveScreen("OutOfStocks");
  };

  const handleVoidReceiptsPress = () => {
    setActiveScreen("VoidReceipts");
  };

  console.log("items", voidReceipts);

  return (
    <View style={styles.scannerui}>
      <View style={styles.transactionboard}>
        <View
          style={{
            width: "100%",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            right: 20,
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
            ARCHIVE
          </Text>
        </View>
      </View>

      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            top: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              handleOutofStocksPress() || handleSortButton();
            }}
            style={{
              backgroundColor: "#D9D9D9",
              justifyContent: "center",
              alignItems: "center",
              width: 100,
              height: 30,
              borderRadius: 50,
              elevation: 5,
              margin: 5,
            }}
          >
            <Text style={{ fontSize: 9, fontFamily: "DMSansBold" }}>
              Out of Stocks
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleVoidReceiptsPress() || handleSortButton();
            }}
            style={{
              backgroundColor: "#D9D9D9",
              justifyContent: "center",
              alignItems: "center",
              width: 100,
              height: 30,
              borderRadius: 50,
              elevation: 5,
              margin: 5,
            }}
          >
            <Text style={{ fontSize: 9, fontFamily: "DMSansBold" }}>
              Void Receipts
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: "80%", top: 20 }}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            {activeScreen === "VoidReceipts" && (
              <>
                {voidReceipts.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      navigation.navigate("VoidTransactionDetails", {
                        transactionid: item.receipt_no,
                      })
                    }
                  >
                    <View
                      style={{ flexDirection: "row", justifyContent: "center" }}
                    >
                      <View
                        style={{
                          borderWidth: 0.5,
                          width: "95%",
                          padding: 13,
                          margin: 5,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{ fontSize: 9, fontFamily: "DMSansMedium" }}
                        >
                          {item.date} | {item.time}
                        </Text>
                        <Text
                          style={{ fontSize: 9, fontFamily: "DMSansMedium" }}
                        >
                          ({item.receipt_no})
                        </Text>
                        {/* Add more Text components or styling for other receipt information */}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}
            {activeScreen === "OutOfStocks" && (
              /* Your content for displaying Out of Stocks */
              <View>
                <>
                  {/* Sort By */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      marginTop: 10,
                      marginRight: 13,
                    }}
                  >
                    <Text style={{ fontFamily: "DMSansBold" }}>Sort By: </Text>
                    <TouchableOpacity
                      style={{
                        padding: 5,
                        backgroundColor: "#F9DC5C",
                        borderRadius: 20,
                        width: 100,
                        marginLeft: 5,
                      }}
                      onPress={handleOpenModal}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontFamily: "DMSansBold",
                        }}
                      >
                        Date
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Search */}
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      marginTop: 10,
                    }}
                  >
                    <Text style={{ marginRight: 20, fontFamily: "DMSansBold" }}>
                      Search:
                    </Text>
                    <TextInput value={searchQuery} onChangeText={handleSearch} style={{ borderWidth: 0.5, width: 250 }} />
                  </View>
                </>
                <FlatList
                  data={itemsForCurrentPage}
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
                          <Text
                            style={{ fontSize: 10, fontFamily: "DMSansBold" }}
                          >
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
                                {item.original_quantity}
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
            )}
          </View>
          
        </View>
        
      </View>
      <View style={{ flexDirection: 'row', marginTop: 10, borderRadius:200 }}>
        {Array.from({ length: totalPages }, (_, index) => (
          <TouchableOpacity
            key={index + 1}
            onPress={() => handlePageClick(index + 1)}
            style={{
              padding: 8,
              margin: 5,
              borderWidth:.5,
              backgroundColor: picked ? '#011936' : '#fff',  // Change the color based on the 'picked' condition

            }}
          >
            <Text style={{ color: picked ? "#fff" : "#000", fontSize:12 }}>{index + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View>
        <Sorting
          data={outOfStocksProducts}
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
          <Text>Content</Text>
        </Sorting>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scannerui: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  transactionboard: {
    width: "100%",
    height: 50,
    backgroundColor: "#011936",
    flexDirection: "row",
    justifyContent: "flex-start",
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

export default Archive;
