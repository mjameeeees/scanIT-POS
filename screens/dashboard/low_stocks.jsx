import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    TouchableOpacity,
    TextInput,
    Modal
  } from "react-native";
  import moment from "moment";
  import { useState, useEffect } from "react";
  import { getProductsBelowWarningLevel } from "../../integration/replenishment";
  import Sorting from "../components/sorting";


  const Low_stocks = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [picked, setPicked] = useState(false);

    useEffect(()=>{
      getProductsBelowWarningLevel()
    .then((products) => {
      setLowStockProducts(products);
      console.log('Products below warning level:', products);
      console.log('Products below warning level in useState:', lowStockProducts);

      // Update your component state or UI with the fetched products
    })
    .catch((error) => {
      console.error('Error fetching products below warning level:', error);
    });
    },[])

    
const handlePageClick = (page) => {
  setPicked(!picked);
  setCurrentPage(page);
};

    
    const sortByName = () => {
      const names = lowStockProducts.sort((a, b) => a.name.localeCompare(b.name));
      setLowStockProducts(names);
  }
  
  const sortbyquantity = () => {
    const names = lowStockProductslowStockProducts.sort((a, b) => b.totalQuantity - a.totalQuantity);
    setLowStockProducts(names);
  }
  
  const sortbywarninglevel = () => {
  const names = lowStockProducts.sort((a, b) => b.warninglevel - a.warninglevel);
  setLowStockProducts(names);
  }
  
  const sortbysrp = () => {
  const names = lowStockProducts.sort((a, b) => b.srp - a.srp);
  setLowStockProducts(names);
  }
  
  const sortbyunit = () => {
  const snacksData = lowStockProducts.sort((a, b) => {
    if (a.unit === b.unit) {
      return a.name.localeCompare(b.name); // Sort by name within the same unit
    } else {
      return a.unit.localeCompare(b.unit); // Sort by unit if units are different
    }
  });
  setLowStockProducts(snacksData);
  }
  
  const sortbylocation = () => {
  snacksData = lowStockProducts.sort((a, b) => {
    if (a.unit === b.unit) {
      return a.name.localeCompare(b.name); // Sort by name within the same location
    } else {
      return a.location.localeCompare(b.location); // Sort by location if location are different
    }
  });
  setLowStockProducts(names);
  }
  
  const sortbypurchasedate = () => {
  snacksData = lowStockProducts.sort((a, b) => moment(b.purchase_date).diff(moment(a.purchase_date)));
  setLowStockProducts(snacksData);
  }
  
  const sortbyexpireddate = () => {
  snacksData = lowStockProducts.sort((a, b) => moment(b.expiry_date).diff(moment(a.expiry_date)));
  setLowStockProducts(snacksData);
  }

  
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredData = lowStockProducts.filter((item) => {
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

 

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };
   
  
   

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
            REPLENISHMENTS
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
          <TextInput onChangeText={handleSearch} value={searchQuery} style={{ borderWidth: 0.5, width: 250 }} />
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
                            {item.productprice} per {item.unit}
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
        </View>
        
      </View>
      <View>
        {modalVisible && (
        <Sorting
          data={lowStockProducts}
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

  
  export default Low_stocks;