import {
  StyleSheet,
  Text,
  View,
  Button,
  Modal,
  TouchableOpacity,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { getWeeklyAggregatedReportsGraph } from "../../integration/report";
import { useEffect, useState } from "react";

const WeeklyGraph = ({ navigation }) => {
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

  const [aggregatedReportsMonthly, setAggregatedReportsMonthly] = useState([]);
  const [profitMonthly, setProfitMonthly] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const toggleModal = () => {
    setIsVisible(!isVisible);
  };
  const [chartDataMonthly, setChartDataMonthly] = useState({
    labels: ["Initial Label"],
    datasets: [
      {
        data: [0], // Initial value
      },
    ],
  });

  useEffect(() => {
    console.log("Fetching and processing data");

    const fetchData = async () => {
      try {
        const reports = await getWeeklyAggregatedReportsGraph();
        setAggregatedReportsMonthly(reports);

        // Process and set profit in the same useEffect
        const profitData = reports.map((report) => report.totalProfit);
        const filteredProfitData = profitData.filter((value) => value !== null);
        setProfitMonthly(filteredProfitData);
      } catch (error) {
        console.error("Error fetching aggregated reports:", error);
      }
    };

    fetchData();

    // Cleanup function (optional)
    return () => {
      setProfitMonthly([]);
    };
  }, []); // Add dependencies if needed

  const fetchData = async () => {
    try {
      const reports = await getWeeklyAggregatedReportsGraph();
      setAggregatedReportsMonthly(reports);

      // Process and set data for the LineChart
      const dateLabels = reports.map((report) => report.week);
      const dataValues = reports.map((report) => report.totalProfit); // Adjust based on your data structure

      // Reverse the order of data
      const reversedDateLabels = dateLabels.reverse();
      const reversedDataValues = dataValues.reverse();

      if (reversedDateLabels.length > 0 && reversedDataValues.length > 0) {
        setChartDataMonthly({
          labels: reversedDateLabels,
          datasets: [
            {
              data: reversedDataValues,
            },
          ],
        });
      } else {
        // Handle case where there is no data
        console.warn("No data available.");
        setChartDataMonthly({
          labels: ["No Data Available"],
          datasets: [
            {
              data: [0],
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching aggregated reports:", error);
      // Handle error as needed
    }
  };

  return (
    <View style={styles.scannerui}>
      <View style={styles.transactionboard}>
        <Text
          style={{
            fontFamily: "DMSansBold",
            fontSize: 20,
            color: "white",
            textAlign: "center",
          }}
        >
          WEEKLY RECORD
        </Text>
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-around",
              marginTop: 5,
            }}
          >
            <Text style={{ fontFamily: "DMSansBold", fontSize: 10 }}>DATE</Text>
            <Text style={{ fontFamily: "DMSansBold", fontSize: 10 }}>
              NET SALES
            </Text>
            <Text style={{ fontFamily: "DMSansBold", fontSize: 10 }}>
              TOTAL COST
            </Text>
            <Text style={{ fontFamily: "DMSansBold", fontSize: 10 }}>
              PROFIT
            </Text>
            <Text style={{ fontFamily: "DMSansBold", fontSize: 10 }}>%</Text>
          </View>
        </View>
        <View>
          {aggregatedReportsMonthly.map((report, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-around",
                marginTop: 10,
              }}
            >
              <Text
                style={{ fontFamily: "DMSansRegular", fontSize: 10, right: 5 }}
              >
                {report.week}
              </Text>
              <Text
                style={{ fontFamily: "DMSansRegular", fontSize: 10, right: 15 }}
              >
                {report.totalNetSales}
              </Text>
              <Text
                style={{ fontFamily: "DMSansRegular", fontSize: 10, left: 8 }}
              >
                {report.totalTotalCost}
              </Text>
              <Text
                style={{ fontFamily: "DMSansRegular", fontSize: 10, left: 23 }}
              >
                {report.totalProfit}
              </Text>
              <Text
                style={{ fontFamily: "DMSansRegular", fontSize: 10, left: 11 }}
              >
                5
              </Text>
            </View>
          ))}
        </View>
        <View style={{ top: 350 }}>
          <View>
            <TouchableOpacity
              onPress={() => {
                setIsVisible(true);
              }}
              style={{
                elevation: 10,
                width: 100,
                height: 25,
                backgroundColor: "#ED254E",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "flex-end",
                marginRight: 10,
                borderRadius: 50,
              }}
            >
              <Text style={{ fontFamily: "DMSansBold", fontSize: 10 }}>
                Show Data
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isVisible}
          onRequestClose={toggleModal}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={{ backgroundColor: "white", padding: 20 }}>
              <Text>Graph</Text>
              <Button
                onPress={() => {
                  fetchData();
                }}
                title="Show Data"
              ></Button>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <LineChart
                  data={chartDataMonthly}
                  width={Dimensions.get("window").width} // from react-native
                  height={220}
                  yAxisLabel="P"
                  yAxisInterval={1} // optional, defaults to 1
                  chartConfig={{
                    backgroundColor: "#e26a00",
                    backgroundGradientFrom: "#fb8c00",
                    backgroundGradientTo: "#ffa726",
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) =>
                      `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: "6",
                      strokeWidth: "2",
                      stroke: "#ffa726",
                    },
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
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

export default WeeklyGraph;
