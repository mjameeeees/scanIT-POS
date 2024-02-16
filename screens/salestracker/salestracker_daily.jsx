import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Button,
    TouchableOpacity,
    Image
  } from "react-native";
  import moment from "moment";
  import * as Sharing from 'expo-sharing';
  import * as Print from 'expo-print';
  import * as FileSystem from 'expo-file-system';  
  import { useEffect, useState } from "react";
  import { getRecentAggregatedReport  } from "../../integration/report";

  const DailyTracker = ({ navigation }) => {
    const Graph = () => {
      /*Navigators for Help*/
      navigation.navigate("DailyGraph");
    };
    const Receipts = () => {
      /*Navigators for Help*/
      navigation.navigate("Transaction");
    };
    const [expirydate, setExpiryDate] = useState(moment().format('YYYY-MM-DD'));
    const [dataByDate, setDataByDate] = useState([]);
    const [data, setDate] = useState([]);

    const [salesData, setSalesData] = useState([]);


    const [recentAggregatedReport, setRecentAggregatedReport] = useState(null);

  useEffect(() => {
    getRecentAggregatedReport()
      .then((result) => {
        setRecentAggregatedReport(result);
      })
      .catch((error) => {
        console.error('Error fetching recent aggregated report:', error);
      });
  }, []);
    
    const processedData = [];

  for (let i = 0; i < salesData.length; i++) {
    const currentSale = salesData[i];
    const currentDate = moment(currentSale.expirydate).format('YYYY-MM-DD');

    // Check if the date has changed or it's the first item
    if (i === 0 || currentDate !== moment(salesData[i - 1].expirydate).format('YYYY-MM-DD')) {
      // Insert a new header item
      processedData.push({
        isHeader: true,
        day: currentDate,
      });
    }

    // Insert the sale item
    processedData.push(currentSale);
  }

  const exportData = () =>{
    generatePDF(recentAggregatedReport);
  }

  const generatePDF = async (recentAggregatedReport) => {
    try {
      // Create HTML content for the PDF
      const htmlContent = `
      <style>
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f2f2f2;
      }
      h2 {
        text-align: center;
      }
      div{
        width: 100%;
      }
    </style>
    <div> 
    <h1>DAILY REPORT</h1>
    <table>
      <tr>
        <th>Daily</th>
        <th>Total Profit</th>
        <th>Total Net Sales</th>
        <th>Total Total Cost</th>
      </tr>
      <tr>
        <td>${recentAggregatedReport.date}</td>
        <td>${recentAggregatedReport.totalProfit}</td>
        <td>${recentAggregatedReport.totalNetSales}</td>
        <td>${recentAggregatedReport.totalTotalCost}</td>
      </tr>
    </table>
    </div>
    
        
      `;

      // Convert HTML to PDF using react-native-html-to-pdf
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      // Define the path in the Download folder
      const downloadFolderPath = FileSystem.documentDirectory + 'Download/';
      const pdfPath = downloadFolderPath + 'recentMonthlyAggregatedReport.pdf';

      // Create the Download folder if it doesn't exist
      await FileSystem.makeDirectoryAsync(downloadFolderPath, { intermediates: true });

      // Move the generated PDF to the Download folder
      await FileSystem.moveAsync({
        from: uri,
        to: pdfPath,
      });
      sharePDF(pdfPath);

      console.log(`PDF saved to: ${pdfPath}`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  const sharePDF = async (pdfPath) => {
    // On Android, use the ACTION_SEND intent
    await Sharing.shareAsync(pdfPath, { mimeType: 'application/pdf', dialogTitle: 'Share PDF' });
  };

    return (
      <View style={styles.scannerui}>
        <View style={styles.transactionboard}>
          <Text style={{ fontFamily: 'DMSansBold', fontSize: 22, color: "white", textAlign: "center", marginRight:15}}>REPORT</Text>
          <Text style={{ fontFamily: 'DMSansBold', fontSize: 8, color: "white", textAlign: "center", marginRight:15, marginBottom:10}}>(DAILY REPORT)</Text>
        </View>
        {recentAggregatedReport ? (
          <View style={{width: "100%"}}>
          <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", margin: 10}}>
            <View style={{flexDirection: "row", marginTop:10,backgroundColor: '#d9d9d9', padding:10}}>
              <Text style={{alignSelf: "center",fontFamily: "DMSansBold"}}>Date:</Text>
              <Text style={{fontFamily: "DMSansMedium", alignSelf: "center", textAlign: "center", fontSize:12, marginLeft:10}}>{expirydate}</Text>
            </View>
              <TouchableOpacity onPress={Graph} style={{marginRight:15, marginTop:10}}>
              <Image
                source={require("./collection.png")}
                style={{
                  height: 25,
                  width: 25,
                  shadowColor: "#d9d9d9",
                  shadowOffset: {width:0, height:0},
                  shadowRadius: 5
                }}
              ></Image>
              </TouchableOpacity>
          </View>
          <View style={{flexDirection: "row", padding: 50, margin:10, borderWidth:.5, justifyContent: "space-between", alignItems: "center"}}>
            <View style={{flexDirection: "row", justifyContent: "space-around"}}>
              <Text style={{fontFamily: "DMSansBold", bottom:15}}>CAPITAL</Text>
            <Text style={{fontFamily: "DMSansBold", marginLeft:35}}>P</Text>
            </View>
            
            <Text style={{fontFamily: "DMSansBold", fontSize: 25}}>{recentAggregatedReport.totalNetSales}</Text>
          </View>
          <View>
          <View style={{flexDirection: "row", padding: 50, margin:10, borderWidth:.5, justifyContent: "space-between", alignItems: "center"}}>
            <View style={{flexDirection: "row", justifyContent: "space-around"}}>
              <Text style={{fontFamily: "DMSansBold", bottom:15}}>NETSALES</Text>
            <Text style={{fontFamily: "DMSansBold", marginLeft:40}}>P</Text>
            </View>
            
            <Text style={{fontFamily: "DMSansBold", fontSize: 25}}>{recentAggregatedReport.totalTotalCost}</Text>
          </View>
          </View>
          <View>
          <View style={{flexDirection: "row", padding: 50, margin:10, borderWidth:.5, justifyContent: "space-between", alignItems: "center"}}>
            <View style={{flexDirection: "row", justifyContent: "space-around"}}>
              <Text style={{fontFamily: "DMSansBold", bottom:15}}>PROFIT</Text>
            <Text style={{fontFamily: "DMSansBold", marginLeft:62}}>P</Text>
            </View>
            
            <Text style={{fontFamily: "DMSansBold", fontSize: 25}}>{recentAggregatedReport.totalProfit}</Text>
          </View>
          </View>

          <TouchableOpacity onPress={exportData} style={{justifyContent: "center",alignSelf: "center", top:20, borderWidth: .5, width: 250, height:50, borderRadius:50}}>
            <Text style={{textAlign: 'center', fontFamily: "DMSansBold", elevation:5}}>EXPORT REPORT</Text>
          </TouchableOpacity>
        </View>
        ) : (
          <Text>No Info</Text>
        )}

     
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    scannerui: {
      flex: 1,
      flexDirection: "column",

      alignItems: "center",
    },
    transactionboard: {
      width: "100%",
      height: 50,
      backgroundColor: "#011936",
      justifyContent: "flex-end",
      alignItems: "flex-end",
    },
    reports: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    reportsInfo: {
      padding: 10,
      fontFamily: "DMSansBold",
      fontSize: 10
    }});
  
  export default DailyTracker;