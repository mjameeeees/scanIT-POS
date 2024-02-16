import React, { memo } from "react";
import { useEffect, useState } from "react";
import moment from "moment";
import { useReducer,useCallback  } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ScrollView,
  Button
} from "react-native";
import { db } from "../DatabaseHelper";
import { OutOfStocks } from "../../integration/outofstocks";
import { InsertNewProductTable } from "../../integration/insertproducts";
import {
  getLatestOutOfStocks
} from "../../integration/outofstocks";
import { getExpiredProducts } from "../../integration/expiredproducts";
import {
  moveExpiredProductsToOutOfStocks,
  moveOutOfStocksToTable,
} from "../../integration/outofstocks";
import { InventoryTable } from "../../integration/inventory";
import { fetchLargestProduct } from "../../integration/bestseller";
import {
  getProductsBelowWarningLevel,
 
} from "../../integration/replenishment";
import { getProductsExpiringSoon } from "../../integration/outofstocks";
import { ExpiredProducts } from "../../integration/expiredproducts";
import { Transactions } from "../../integration/transaction";
import { Reports } from "../../integration/report";
import { BestSellersProduct } from "../../integration/bestseller";
import { VoidReceipts } from "../../integration/void_receipts";

const Dashboard = ({ navigation }) => {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const Inventory = () => {
    /*Navigators for Inventory*/
    setRefreshFlag(true);
    navigation.navigate("Inventory");
  };

  const Scanner = () => {
    setRefreshFlag(true);
    /*Navigators for Scanner*/
    navigation.navigate("Scanner");
  };

  const Salestracker = () => {
    /*Navigators for Salestracker*/
    setRefreshFlag(true);
    navigation.navigate("Salestracker");
  };

  const Map = () => {
    /*Navigators for Salestracker*/
    setRefreshFlag(true);
    navigation.navigate("Map");
  };

  const Archive = () => {
    /*Navigators for Salestracker*/
    setRefreshFlag(true);
    navigation.navigate("Archive");
  };

  const Help = () => {
    /*Navigators for Help*/
    setRefreshFlag(true);
    navigation.navigate("Help");
  };

  const Expired_products = () => {
    /*Navigators for Help*/
    setRefreshFlag(false);
    navigation.navigate("Expired_products");
  };

  const Low_stocks = () => {
    /*Navigators for Help*/
    setRefreshFlag(true);
    navigation.navigate("Low_stocks");
  };
  const BestSeller = () => {
    /*Navigators for Help*/
    setRefreshFlag(true);
    navigation.navigate("BestSeller");
  };


  useEffect(() => {
    InsertNewProductTable();
    Transactions();
    Reports();
    BestSellersProduct();
    VoidReceipts();
    ExpiredProducts();
    OutOfStocks();
  }, []);


  
  useEffect(() => {
    InventoryTable();
    fetchBestSeller();
    fetchPerishable();
    outofstocks();
    fetchReplenishment();
    weekPerishable();
    report();
  }, []);

  const [perishables, setPerishables] = useState(undefined);

  const [posInventoryNotifications, setPosInventoryNotifications] = useState(
    []
  );

  const [greeting, setGreeting] = useState("");

  const fetchPerishable = async () => {
    try {
      // Fetch the expired products and update the inventory data
      const expiredProducts = await getExpiredProducts();
      setPerishables(expiredProducts);
    } catch (error) {
      console.error("Error fetching Last Expiring Products:", error);
      // Handle errors if necessary
    }
  };

  const [weekPerishables, setWeekPerishables] = useState(undefined);
  const weekPerishable = async () => {
    try {
      // Fetch the largest product and update the inventory data
      const latestexpiringProduct = await getProductsExpiringSoon();
      setWeekPerishables(latestexpiringProduct);
    } catch (error) {
      console.error("Error fetching Last Expiring Products:", error);
      // Handle errors if necessary
    }
  };
  
  const [bestSeller, setBestSeller] = useState(undefined);

  const fetchBestSeller = async () => {
    try {
      // Fetch the largest product and update the inventory data
      const largestProduct = await fetchLargestProduct();
      setBestSeller(largestProduct);
    } catch (error) {
      console.error("Error fetching best seller:", error);
      // Handle errors if necessary
    }
  };

  const [replenishment, setReplenishment] = useState(undefined);

  const fetchReplenishment = async () => {
    try {
      // Fetch the largest product and update the inventory data
      const belowWarningLevelProducts = await getProductsBelowWarningLevel();
      setReplenishment(belowWarningLevelProducts.name);
    } catch (error) {
      console.error("Error fetching Replenishment:", error);
      // Handle errors if necessary
    }
  };

  const [outOfStocks, setOutOfStocks] = useState(undefined);

  const outofstocks = async () => {
    try {
      // Fetch the largest product and update the inventory data
      const outofstocks = await getLatestOutOfStocks();
      setOutOfStocks(outofstocks);
    } catch (error) {
      console.error("Error fetching out of stocks:", error);
      // Handle errors if necessary
    }
  };

  const [Report, setReport] = useState(undefined);
  const report = () => {
    const isMonthlyReportDay = moment().date() === 1;
    setReport(isMonthlyReportDay);
  };


  useEffect(() => {
    // Get the current hour of the day
    const currentHour = new Date().getHours();

    // Set the greeting based on the current hour
    if (currentHour >= 5 && currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour >= 12 && currentHour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

 
  const [message, setMessage] = useState("");
  console.log(message);
  useEffect(() => {
    const handleMoveOutOfStocks = async () => {
      try {
        const deletedRows = await moveOutOfStocksToTable();
        setMessage(
          `Successfully moved ${deletedRows} rows with zero quantity to outofstocks_table.`
        );
      } catch (error) {
        setMessage("Error moving rows to outofstocks_table: " + error.message);
      }
    };

    handleMoveOutOfStocks();
  }, []);

  useEffect(() => {
    console.log("Component is mounting or updating.");
  
    const moveExpiredData = async () => {
      try {
        console.log("Moving expired data...");
        const movedProducts = await moveExpiredProductsToOutOfStocks();
        if (movedProducts.length > 0) {
          console.log(`Moved ${movedProducts.length} expired products to outofstocks_table.`);
        } else {
          console.log("No expired products found to move.");
        }
      } catch (error) {
        console.error("Error moving expired products:", error);
        // Handle error as needed
      }
    };
  
    // Trigger automatic move when the component mounts
    moveExpiredData();
  }, []);

  console.log("Best Seller: ", bestSeller);
  console.log("Out of Stocks: ", outOfStocks);
  console.log("Replenishment: ", replenishment);
  console.log("Expired Products: ", perishables);
  const [loading, setLoading] = useState(true); // Initially set loading to true
  const [initialRender, setInitialRender] = useState(true);
  const [refresh, setRefresh] = useState(false); // State to trigger a re-render
  const [, forceUpdate] = useReducer((x) => x + 1, 0); // useReducer trick for forceUpdate

  const fetchData = async () => {
    try {
      // Replace the following with your actual asynchronous logic to fetch data
      // For demonstration purposes, I'm using a setTimeout to simulate an async operation
      setRefreshFlag(true);

      const newData = [
        replenishment && replenishment.lentgh
          ? `Your ${replenishment[0].name} is low stock`
          : undefined,
        bestSeller && bestSeller.length > 0
          ? `Your ${bestSeller[0].name} is your best seller product.`
          : undefined,
        outOfStocks && outOfStocks.length > 0
          ? <Text style={{color: "red"}}>{`Product ${outOfStocks[0].name} is out of stock.`}</Text> 
          : undefined,
        weekPerishables && weekPerishables.length > 0
          ? `${weekPerishables[0].name} will expire this week.`
          : undefined,
        perishables && perishables.length
          ? <Text style={{color: "green"}}>{`${perishables[0].name}  is expired.`}</Text> 
          : undefined,
        Report ? "Monthly Report is out now!" : undefined,
      ].filter((message) => message !== undefined);

      console.log("New Data:", newData); // Log the new data

      if (newData.length > 0) {
        setPosInventoryNotifications(newData);
        setLoading(false); // Set loading to false regardless of success or failure
      }
      setPosInventoryNotifications(newData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setRefreshFlag(false); // Set isRefreshing to false after data fetching completes

      setInitialRender(false); // Set initialRender to false after the initial render
      setRefresh(!refresh); // Trigger re-render
    }
  };
const [isRefreshing, setIsRefreshing] = useState(false);
  useEffect(() => {
    fetchData();
  }, [refreshFlag]);

  const onRefresh = useCallback(() => {
    setRefreshFlag(true); // Set isRefreshing to true to show the loading indicator
    fetchData(); // Fetch data when pull-to-refresh is triggered
  }, [refreshFlag]);
  
  return (
    /*Screen Dashboard UI*/
    <View styles={styles.dashboardscreen}>
      <View style={{ height: "99%" }}>
        <View style={styles.square}>
          <View>
            <Text
              style={{
                fontFamily: "DMSansBold",
                fontSize: 18,
                color: "white",
                marginTop: 10,

                textAlign: "center",
              }}
            >
              {greeting}
            </Text>
          </View>
        </View>
        <View style={styles.notification}>
          <Text style={styles.textnotification}>NAVIGATION</Text>
          <View
            style={{
              justifyContent: "space-evenly",
              alignItems: "center",
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={Expired_products}
                  style={styles.circle}
                >
                  <Image
                    source={require("./expired.png")}
                    style={{
                      height: 30,
                      width: 30,
                      shadowColor: "#d9d9d9",
                      shadowOffset: { width: 0, height: 0 },
                      shadowRadius: 5,
                    }}
                  ></Image>
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: "DMSansBold",
                    margin: 10,
                    fontSize: 10,
                    textAlign: "center",
                    bottom: 10,
                  }}
                >
                  Perishables
                </Text>
              </View>

              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity onPress={BestSeller} style={styles.circle}>
                  <Image
                    source={require("./best.png")}
                    style={{
                      height: 30,
                      width: 30,
                      shadowColor: "#d9d9d9",
                      shadowOffset: { width: 0, height: 0 },
                      shadowRadius: 5,
                    }}
                  ></Image>
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: "DMSansBold",
                    margin: 10,
                    fontSize: 10,
                    textAlign: "center",
                    bottom: 10,
                  }}
                >
                  Best Sellers
                </Text>
              </View>

              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity onPress={Low_stocks} style={styles.circle}>
                  <Image
                    source={require("./replenish.png")}
                    style={{
                      height: 30,
                      width: 30,
                      shadowColor: "#d9d9d9",
                      shadowOffset: { width: 0, height: 0 },
                      shadowRadius: 5,
                    }}
                  ></Image>
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: "DMSansBold",
                    margin: 10,
                    fontSize: 10,
                    textAlign: "center",
                    bottom: 10,
                  }}
                >
                  Replenisment
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              justifyContent: "space-evenly",
              alignItems: "center",
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity onPress={Archive} style={styles.circle}>
                  <Image
                    source={require("./archive.png")}
                    style={{
                      height: 30,
                      width: 30,
                      shadowColor: "#d9d9d9",
                      shadowOffset: { width: 0, height: 0 },
                      shadowRadius: 5,
                    }}
                  ></Image>
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: "DMSansBold",
                    margin: 10,
                    fontSize: 10,
                    textAlign: "center",
                    bottom: 10,
                  }}
                >
                  Archive
                </Text>
              </View>

              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity onPress={Map} style={styles.circle}>
                  <Image
                    source={require("./cyber-security.png")}
                    style={{
                      height: 30,
                      width: 30,
                      shadowColor: "#d9d9d9",
                      shadowOffset: { width: 0, height: 0 },
                      shadowRadius: 5,
                    }}
                  ></Image>
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: "DMSansBold",
                    margin: 10,
                    fontSize: 10,
                    textAlign: "center",
                    bottom: 10,
                  }}
                >
                  Security
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.line}></View>
          <Text style={styles.textnotification}>NOTIFICATION</Text>
          <View style={{ width: "90%", marginLeft: 25, height: 200 }}>
            {loading && initialRender ? (
              <View></View>
            ) : (
              <FlatList
                data={posInventoryNotifications}
                keyExtractor={(item, index) => index.toString()}
                refreshControl={
                  <RefreshControl refreshing={refreshFlag} onRefresh={onRefresh} />
                }
                renderItem={({ item }) => (
                  <Text
                    style={{
                      margin: 3,
                      fontFamily: "DMSansRegular",
                      fontSize: 10,
                    }}
                  >
                    {item}
                  </Text>
                )}
                extraData={refresh}
              />
            )}
          </View>
        </View>
        <TouchableOpacity style={styles.scan} onPress={Scanner}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 0.5,
              width: "95%",
              height: 120,

              borderRadius: 20,
            }}
          >
            <View>
              <Image
                source={require("./scanner.png")}
                style={{
                  height: 50,
                  width: 50,
                  shadowColor: "#d9d9d9",
                  shadowOffset: { width: 0, height: 0 },
                  shadowRadius: 5,
                }}
              ></Image>
            </View>
            <Text style={{ fontFamily: "DMSansBold", fontWeight: "900" }}>
              Scan IT Now!
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.rectangle}>
          <View>
            <TouchableOpacity onPress={Inventory} style={{ padding: 25 }}>
              <Image
                source={require("./item.png")}
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity onPress={Salestracker} style={{ padding: 25 }}>
              <Image
                source={require("./report.png")}
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={Help} style={{ padding: 25 }}>
              <Image
                source={require("./help.png")}
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dashboardscreen: {
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#DBF9F0",
  },
  square: {
    width: "100%",
    height: 70,
    flexDirection: "column",
    backgroundColor: "#011936",
    justifyContent: "center",
    alignContent: "center",
  },
  notificationText: {
    fontFamily: "DMSansBold",
    padding: 5,
    fontSize: 10,
    backgroundColor: "#E36414",
    width: 100,
    marginTop: 10,
    marginLeft: 15,
  },
  circle: {
    width: 30, // You can adjust the width as needed
    height: 30, // You can adjust the height as needed
    borderRadius: 50, // Set the borderRadius to half of the width and height to make it a circle
    alignSelf: "center",
  },
  text: {
    fontFamily: "DMSansBold",
    color: "#f4fffd",
    textAlign: "center",
    fontSize: 15,
  },
  textnotification: {
    opacity: 0.5,
    fontFamily: "DMSansBold",
    color: "#011936",
    fontWeight: "bold",
    margin: 10,
    textAlign: "center",
  },
  notification: {
    width: "95%",
    alignSelf: "center",
    height: "60%",
    backgroundColor: "#D9D9D9",
    borderRadius: 30,
    margin: 10,
  },
  line: {
    alignSelf: "center",
    width: "80%", // You can adjust the width as needed
    height: 1, // You can adjust the height as needed
    backgroundColor: "black", // You can adjust the color as needed
  },
  scan: {
    marginBottom: 10,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  rectangle: {
    width: "95%",
    height: "8.5%",
    flexDirection: "row",
    backgroundColor: "#011936",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    borderRadius: 100,
    alignSelf: "center",
  },
});

export default memo(Dashboard);
