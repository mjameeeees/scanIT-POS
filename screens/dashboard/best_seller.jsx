import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Button,
} from "react-native";
import { useState, useEffect } from "react";
import { fetchBestsellerData } from "../../integration/bestseller";
import moment from "moment";
import { ScrollView } from "react-native-gesture-handler";
import Sorting from "../components/sorting";

const BestSeller = ({ navigation }) => {
  const [isVisibleSort, setIsVisibleSort] = useState(false);
  const [selectedCategoryColor, setSelectedCategoryColor] = useState("SNACKS");

  const [searchQuery, setSearchQuery] = useState("");
  const [bestsellerData, setBestsellerData] = useState([]);
  const [chosen, setChosen] = useState(bestsellerData);
  console.log(chosen);
  const sortByName = () => {
    const names = chosen.sort((a, b) => a.name.localeCompare(b.name));
    setChosen(names);
  };

  const sortbyquantity = () => {
    const names = chosen.sort((a, b) => b.totalQuantity - a.totalQuantity);
    setChosen(names);
  };

  const sortbywarninglevel = () => {
    const names = chosen.sort((a, b) => b.warninglevel - a.warninglevel);
    setChosen(names);
  };

  const sortbysrp = () => {
    const names = chosen.sort((a, b) => b.srp - a.srp);
    setChosen(names);
  };

  const sortbyunit = () => {
    const snacksData = chosen.sort((a, b) => {
      if (a.location === b.unit) {
        return a.name.localeCompare(b.name); // Sort by name within the same unit
      } else {
        return a.unit.localeCompare(b.unit); // Sort by unit if units are different
      }
    });
    setChosen(snacksData);
  };

  const sortbylocation = () => {
    snacksData = chosen.sort((a, b) => {
      if (a.unit === b.unit) {
        return a.name.localeCompare(b.name); // Sort by name within the same location
      } else {
        return a.location.localeCompare(b.location); // Sort by location if location are different
      }
    });
    setChosen(snacksData);
  };

  const sortbypurchasedate = () => {
    snacksData = chosen.sort((a, b) =>
      moment(b.purchase_date).diff(moment(a.purchase_date))
    );
    setIsVisibleSort(false);
    setChosen(snacksData);
  };

  const sortbyexpireddate = () => {
    snacksData = chosen.sort((a, b) =>
      moment(b.expiry_date).diff(moment(a.expiry_date))
    );
    setIsVisibleSort(false);
    setChosen(snacksData);
  };

  useEffect(() => {
    getSnacks();
    getBeverages();
    getOthers();
    getAll();
  }, []);

  const getSnacks = () => {
    const snacks = bestsellerData.filter((item) => item.category === "Snacks");
    setChosen(snacks);
    console.log("Snacks: ", snacks);
    setSelectedCategoryColor("SNACKS");
  };

  const getBeverages = () => {
    const beverages = bestsellerData.filter(
      (item) => item.category === "Beverages"
    );
    setChosen(beverages);
    console.log("Beverages: ", beverages);
    console.log("Bev Container: ", chosen);
    setSelectedCategoryColor("BEVERAGES");
  };

  const getOthers = () => {
    const others = bestsellerData.filter((item) => item.category === "Others");
    setChosen(others);
    console.log("Others: ", others);
    console.log("Others Container: ", chosen);
    setSelectedCategoryColor("OTHERS");
  };

  const getAll = () => {
    const all = bestsellerData;
    setChosen(all);
    console.log(all);
    setSelectedCategoryColor("ALL");
  };
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  const [selectedCategory, setSelectedCategory] = useState(bestsellerData); // Initialize with "All" or your default category

  const filteredData = chosen.filter((item) => {
    const lowerCaseQuery = searchQuery.toLowerCase();

    // Check if the item is defined
    if (!item) {
      return false;
    }

    // Check if item.name and item.code are defined before accessing their properties
    const itemName = item.name ? item.name.toLowerCase() : "";
    const itemCode = item.code ? item.code.toLowerCase() : "";

    return (
      itemName.includes(lowerCaseQuery) || itemCode.includes(lowerCaseQuery)
    );
  });

  const generateRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
  };

  const customChartConfig = {
    ...chartConfig,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    decimalPlaces: 2,
    propsForLabels: {
      fontFamily: "DMSansRegular", // Set your desired font family
    },
  };

  const [graphData, setGraphData] = useState([
    {
      name: "Product",
      quantity: 0,
      category: "Snacks",
    },
  ]);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    // Fetch and set the bestseller data when the component mounts
    const fetchData = async () => {
      try {
        const data = await fetchBestsellerData();
        setGraphData(data);
      } catch (error) {
        console.error("Error fetching bestseller data:", error);
        // Handle error as needed
      }
    };

    if (showChart) {
      // Call the fetchData function when showChart is true
      fetchData();
    }
  }, [showChart]); // The dependency array ensures that the effect runs whenever showChart changes

  useEffect(() => {
    // Fetch and set the bestseller data when the component mounts
    fetchBestsellerData()
      .then((data) => setBestsellerData(data))
      .catch((error) =>
        console.error("Error fetching bestseller data:", error)
      );
  }, []);

  useEffect(() => {
    // Fetch and set the bestseller data when the component mounts
    fetchBestsellerData()
      .then((data) => setChosen(data))
      .catch((error) =>
        console.error("Error fetching bestseller data:", error)
      );
  }, []);

  const handleButtonClick = () => {
    // Set showChart to true when the button is clicked
    setShowChart(true);
  };
  const [modalVisible, setModalVisible] = useState(false);

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
            BEST SELLERS
          </Text>
        </View>
      </View>

      <View style={{ height: "100%" }}>
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
          <TextInput
            value={searchQuery}
            onChangeText={handleSearch}
            style={{ borderWidth: 0.5, width: 250 }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            onPress={getSnacks}
            style={{
              backgroundColor:
                selectedCategoryColor === "SNACKS" ? "#ED254E" : "#D9D9D9",
              justifyContent: "center",
              alignItems: "center",
              width: 80,
              height: 30,
              borderRadius: 50,
              elevation: 5,
              margin: 5,
            }}
          >
            <Text style={{ fontSize: 9, fontFamily: "DMSansBold" }}>
              SNACKS
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={getBeverages}
            style={{
              backgroundColor:
                selectedCategoryColor === "BEVERAGES" ? "#ED254E" : "#D9D9D9",
              justifyContent: "center",
              alignItems: "center",
              width: 80,
              height: 30,
              borderRadius: 50,
              elevation: 5,
              margin: 5,
            }}
          >
            <Text style={{ fontSize: 9, fontFamily: "DMSansBold" }}>
              BEVERAGES
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={getOthers}
            style={{
              backgroundColor:
                selectedCategoryColor === "OTHERS" ? "#ED254E" : "#D9D9D9",
              justifyContent: "center",
              alignItems: "center",
              width: 80,
              height: 30,
              borderRadius: 50,
              elevation: 5,
              margin: 5,
            }}
          >
            <Text style={{ fontSize: 9, fontFamily: "DMSansBold" }}>
              OTHERS
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={getAll}
            style={{
              backgroundColor:
                selectedCategoryColor === "ALL" ? "#ED254E" : "#D9D9D9",
              justifyContent: "center",
              alignItems: "center",
              width: 80,
              height: 30,
              borderRadius: 50,
              elevation: 5,
              margin: 5,
            }}
          >
            <Text style={{ fontSize: 9, fontFamily: "DMSansBold" }}>ALL</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FlatList
            data={filteredData}
            numColumns={1}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <ScrollView>
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
                            Total Quantity:{" "}
                            <Text style={{ fontFamily: "DMSansRegular" }}>
                              {item.totalQuantity}
                            </Text>
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Additional logic or UI elements specific to each category */}
                  </View>
                </View>
              </ScrollView>
            )}
          />
        </View>
      </View>
      <View>
        {modalVisible && (
          <Sorting
            data={chosen}
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

export default BestSeller;
