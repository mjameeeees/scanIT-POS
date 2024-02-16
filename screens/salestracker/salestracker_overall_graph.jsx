import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import { getAggregatedReports,getWeeklyAggregatedReportsGraph, getMonthlyAggregatedReportsGraph } from "../../integration/report";
import { useState } from "react";
import { useEffect } from "react";

const OverallGraph = ({ navigation }) => {
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

  const [showDailyReport, setShowDailyReport] = useState(false);
  const [showWeeklyReport, setShowWeeklyReport] = useState(false);
  const [showMonthlyReport, setShowMonthlyReport] = useState(false);
  const [profit, setProfit] = useState([]);
  const [aggregatedReports, setAggregatedReports] = useState([]);


  const [chartData, setChartData] = useState({
    labels: ['Initial Label'],
    datasets: [
      {
        data: [0], // Initial value
      },
    ],
  });

  
  const fetchData = async () => {
    try {
      const reports = await getAggregatedReports();
      setAggregatedReports(reports);
  
      // Process and set data for the LineChart
      const dateLabels = reports.map((report) => report.date);
      const dataValues = reports.map((report) => report.totalProfit); // Adjust based on your data structure
  
      // Reverse the order of data
      const reversedDateLabels = dateLabels.reverse();
      const reversedDataValues = dataValues.reverse();
  
      if (reversedDateLabels.length > 0 && reversedDataValues.length > 0) {
        setChartData({
          labels: reversedDateLabels,
          datasets: [
            {
              data: reversedDataValues,
            },
          ],
        });
      } else {
        // Handle case where there is no data
        console.warn('No data available.');
        setChartData({
          labels: ['No Data Available'],
          datasets: [
            {
              data: [0],
            },
          ],
        });
      }
    } catch (error) {
      console.error('Error fetching aggregated reports:', error);
      // Handle error as needed
    }
  };

  useEffect(() => {
    console.log('Fetching and processing data');

    const fetchData = async () => {
      try {
        const reports = await getAggregatedReports();
        setAggregatedReports(reports);

        // Process and set profit in the same useEffect
        const profitData = reports.map((report) => report.totalProfit);
        const filteredProfitData = profitData.filter(value => value !== null);
        setProfit(filteredProfitData);

        const dateLabels = reports.map((report) => report.date);
        const dataValues = reports.map((report) => report.value); // Adjust based on your data structure
        setChartData({
          labels: dateLabels,
          datasets: [
            {
              data: dataValues,
            },
          ],
        });

      } catch (error) {
        console.error('Error fetching aggregated reports:', error);
      }
    };

    fetchData();

    // Cleanup function (optional)
    return () => {
      setProfit([]);
    };
  }, []); // Add dependencies if needed



  //Weekly Data

  const [aggregatedReportsWeekly, setAggregatedReportsWeekly] = useState([]);
  const [profitMonthly, setProfitMonthly] = useState([]);

  const [chartDataWeekly, setChartDataWeekly] = useState({
    labels: ['Initial Label'],
    datasets: [
      {
        data: [0], // Initial value
      },
    ],
  });

  useEffect(() => {
    console.log('Fetching and processing data');

    const fetchData = async () => {
      try {
        const reports = await getWeeklyAggregatedReportsGraph();
        setAggregatedReportsWeekly(reports);

        // Process and set profit in the same useEffect
        const profitData = reports.map((report) => report.totalProfit);
        const filteredProfitData = profitData.filter(value => value !== null);
        setProfitMonthly(filteredProfitData);

        const dateLabels = reports.map((report) => report.week);
        const dataValues = reports.map((report) => report.value); // Adjust based on your data structure
        setChartDataWeekly({
          labels: dateLabels,
          datasets: [
            {
              data: dataValues,
            },
          ],
        });
          console.log(aggregatedReportsWeekly)
      } catch (error) {
        console.error('Error fetching aggregated reports:', error);
      }
    };

    fetchData();

    // Cleanup function (optional)
    return () => {
      setProfitMonthly([]);
    };
  }, []); // Add dependencies if needed

  const fetchDataWeekly = async () => {
    try {
      const reports = await getWeeklyAggregatedReportsGraph();
      setAggregatedReports(reports);
  
      // Process and set data for the LineChart
      const dateLabels = reports.map((report) => report.week);
      const dataValues = reports.map((report) => report.totalProfit); // Adjust based on your data structure
  
      // Reverse the order of data
      const reversedDateLabels = dateLabels.reverse();
      const reversedDataValues = dataValues.reverse();
  
      if (reversedDateLabels.length > 0 && reversedDataValues.length > 0) {
        setChartDataWeekly({
          labels: reversedDateLabels,
          datasets: [
            {
              data: reversedDataValues,
            },
          ],
        });
      } else {
        // Handle case where there is no data
        console.warn('No data available.');
        setChartDataWeekly({
          labels: ['No Data Available'],
          datasets: [
            {
              data: [0],
            },
          ],
        });
      }
    } catch (error) {
      console.error('Error fetching aggregated reports:', error);
      // Handle error as needed
    }
  };

  //Monthly Data

  const [aggregatedReportsMonthly, setAggregatedReportsMonthly] = useState([]);
  const [chartDataMonthly, setChartDataMonthly] = useState({
    labels: ['Initial Label'],
    datasets: [
      {
        data: [0], // Initial value
      },
    ],
  });

  
  const fetchDataMonthly = async () => {
    try {
      const reports = await getMonthlyAggregatedReportsGraph();
      setAggregatedReportsMonthly(reports);
  
      // Process and set data for the LineChart
      const dateLabels = reports.map((report) => report.month);
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
        console.warn('No data available.');
        setChartDataMonthly({
          labels: ['No Data Available'],
          datasets: [
            {
              data: [0],
            },
          ],
        });
      }
    } catch (error) {
      console.error('Error fetching aggregated reports:', error);
      // Handle error as needed
    }
  };

  useEffect(() => {
    console.log('Fetching and processing data');

    const fetchData = async () => {
      try {
        const reports = await getMonthlyAggregatedReportsGraph();
        setAggregatedReportsMonthly(reports);

        // Process and set profit in the same useEffect
        const profitData = reports.map((report) => report.totalProfit);
        const filteredProfitData = profitData.filter(value => value !== null);
        setProfit(filteredProfitData);

        const dateLabels = reports.map((report) => report.month);
        const dataValues = reports.map((report) => report.value); // Adjust based on your data structure
        setChartDataMonthly({
          labels: dateLabels,
          datasets: [
            {
              data: dataValues,
            },
          ],
        });

      } catch (error) {
        console.error('Error fetching aggregated reports:', error);
      }
    };

    fetchData();

    // Cleanup function (optional)
    return () => {
      setProfit([]);
    };
  }, []); // Add dependencies if needed

  const toggleDailyReport = () => {
    setShowDailyReport(!showDailyReport);
    setShowWeeklyReport(false);
    setShowMonthlyReport(false);
  };

  const toggleWeeklyReport = () => {
    setShowWeeklyReport(!showWeeklyReport);
    setShowDailyReport(false);
    setShowMonthlyReport(false);
  };

  const toggleMonthlyReport = () => {
    setShowMonthlyReport(!showMonthlyReport);
    setShowDailyReport(false);
    setShowWeeklyReport(false);
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
          OVER ALL RECORD
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-around",
        }}
      >
        <TouchableOpacity
          onPress={toggleDailyReport}
          style={{
            padding: 10,
            borderRadius: 50,
            backgroundColor: "#D9D9D9",
            margin: 10,
            elevation: 5,
          }}
        >
          <Text style={{ fontFamily: "DMSansBold", fontSize: 10 }}>
            DAILY REPORT
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={toggleWeeklyReport}
          style={{
            padding: 10,
            borderRadius: 50,
            backgroundColor: "#D9D9D9",
            margin: 10,
            elevation: 5,
          }}
        >
          <Text style={{ fontFamily: "DMSansBold", fontSize: 10 }}>
            WEEKLY REPORT
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={toggleMonthlyReport}
          style={{
            padding: 10,
            borderRadius: 50,
            backgroundColor: "#D9D9D9",
            margin: 10,
            elevation: 5,
          }}
        >
          <Text style={{ fontFamily: "DMSansBold", fontSize: 10 }}>
            MONTHLY REPORT
          </Text>
        </TouchableOpacity>
      </View>

        {showDailyReport && (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontFamily: "DMSansBold", fontSize: 20 }}>
              DAILY REPORT
            </Text>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-around",
                  marginTop: 5,
                }}
              >
                <Text style={{ fontFamily: "DMSansBold", fontSize: 10 }}>
                  DATE
                </Text>
                <Text style={{ fontFamily: "DMSansBold", fontSize: 10 }}>
                  NET SALES
                </Text>
                <Text style={{ fontFamily: "DMSansBold", fontSize: 10 }}>
                  TOTAL COST
                </Text>

              </View>
            </View>
            <View>
              {aggregatedReports.map((report, index)=> (
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
                  style={{
                    fontFamily: "DMSansRegular",
                    fontSize: 10,
                    right: 5,
                  }}
                >
                 {report.date}
                </Text>
                <Text
                  style={{
                    fontFamily: "DMSansRegular",
                    fontSize: 10,
                    right: 15,
                  }}
                >
                  {report.totalNetSales}
                </Text>
                <Text
                  style={{ fontFamily: "DMSansRegular", fontSize: 10, left: 8 }}
                >
                  {report.totalTotalCost}
                </Text>
                <Text
                  style={{
                    fontFamily: "DMSansRegular",
                    fontSize: 10,
                    left: 23,
                  }}
                >
                  {report.totalProfit}
                </Text>
                <Text
                  style={{
                    fontFamily: "DMSansRegular",
                    fontSize: 10, 
                    left: 11,
                  }}
                >
                  5
                </Text>
              </View>

              ))}
              
            </View>
            <View style={{top:350}}>

        </View>
          </View>
        )}
      

      <View>
        {showWeeklyReport && (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontFamily: "DMSansBold", fontSize: 20 }}>
              WEEKLY REPORT
            </Text>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-around",
                  marginTop: 5,
                }}
              >
                <Text style={{ fontFamily: "DMSansBold", fontSize: 10 }}>
                  DATE
                </Text>
                <Text style={{ fontFamily: "DMSansBold", fontSize: 10 }}>
                  NET SALES
                </Text>
                <Text style={{ fontFamily: "DMSansBold", fontSize: 10 }}>
                  TOTAL COST
                </Text>
                <Text style={{ fontFamily: "DMSansBold", fontSize: 10 }}>
                  PROFIT
                </Text>
                <Text style={{ fontFamily: "DMSansBold", fontSize: 10 }}>
                  %
                </Text>
              </View>
            </View>
            <View>
            {aggregatedReportsWeekly.map((report, index)=> (
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
                  style={{
                    fontFamily: "DMSansRegular",
                    fontSize: 10,
                    right: 5,
                  }}
                >
                 {report.week}
                </Text>
                <Text
                  style={{
                    fontFamily: "DMSansRegular",
                    fontSize: 10,
                    right: 15,
                  }}
                >
                  {report.totalNetSales}
                </Text>
                <Text
                  style={{ fontFamily: "DMSansRegular", fontSize: 10, left: 8 }}
                >
                  {report.totalTotalCost}
                </Text>
                <Text
                  style={{
                    fontFamily: "DMSansRegular",
                    fontSize: 10,
                    left: 23,
                  }}
                >
                  {report.totalProfit}
                </Text>
                <Text
                  style={{
                    fontFamily: "DMSansRegular",
                    fontSize: 10, 
                    left: 11,
                  }}
                >
                  5
                </Text>
              </View>

              ))}
            </View>
           
          </View>
        )}
      </View>
      <View>
        {showMonthlyReport && (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontFamily: "DMSansBold", fontSize: 20 }}>
            MONTHLY REPORT
          </Text>
          <View>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-around",
                marginTop: 5,
              }}
            >
              <Text style={{ fontFamily: "DMSansBold", fontSize: 10 }}>
                DATE
              </Text>
              <Text style={{ fontFamily: "DMSansBold", fontSize: 10 }}>
                NET SALES
              </Text>
              <Text style={{ fontFamily: "DMSansBold", fontSize: 10 }}>
                TOTAL COST
              </Text>
              <Text style={{ fontFamily: "DMSansBold", fontSize: 10 }}>
                PROFIT
              </Text>
              <Text style={{ fontFamily: "DMSansBold", fontSize: 10 }}>
                %
              </Text>
            </View>
          </View>
          <View>
          {aggregatedReportsMonthly.map((report, index)=> (
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
                style={{
                  fontFamily: "DMSansRegular",
                  fontSize: 10,
                  right: 5,
                }}
              >
               {report.month}
              </Text>
              <Text
                style={{
                  fontFamily: "DMSansRegular",
                  fontSize: 10,
                  right: 15,
                }}
              >
                {report.totalNetSales}
              </Text>
              <Text
                style={{ fontFamily: "DMSansRegular", fontSize: 10, left: 8 }}
              >
                {report.totalTotalCost}
              </Text>
              <Text
                style={{
                  fontFamily: "DMSansRegular",
                  fontSize: 10,
                  left: 23,
                }}
              >
                {report.totalProfit}
              </Text>
              <Text
                style={{
                  fontFamily: "DMSansRegular",
                  fontSize: 10, 
                  left: 11,
                }}
              >
                5
              </Text>
            </View>

            ))}
          </View>
          
        </View>
        )}
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

export default OverallGraph;
