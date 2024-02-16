import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  PanResponder,
  Image,
  ActivityIndicator,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { ToastAndroid } from "react-native";
import * as FileSystem from "expo-file-system";
import { deleteRowsWithAllNulls } from "../../integration/insertdata";
import * as DocumentPicker from "expo-document-picker";
import { useState, useEffect } from "react";
import { exportDataTo } from "../../integration/global";
import { exportDataAndSave } from "../../integration/global";
import Papa from "papaparse";
import {
  insertReport,
  insertProduct,
  insertReceipt,
} from "../../integration/insertdata";
import { deleteAll } from "../../integration/global";

const Map = ({ route }) => {
  const [tapCount, setTapCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [insertData, setInsertData] = useState(false);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setTapCount((prevCount) => prevCount + 1);
      if (tapCount === 2) {
        setModalVisible(true);
      }
    },
  });

  const closeModal = () => {
    setModalVisible(false);
    setTapCount(0); // Reset tap count after closing the modal
  };

  const deleteAllData = () => {
    deleteAll();
    closeModal();
  };

  const showToastProduct = () => {
    ToastAndroid.show("Inventory Inserted Successfully!", ToastAndroid.SHORT);
  };

  const showToastReport = () => {
    ToastAndroid.show("Report Inserted Successfully!", ToastAndroid.SHORT);
  };

  const showToastReceipts = () => {
    ToastAndroid.show("Receipts Inserted Successfully!", ToastAndroid.SHORT);
  };

  const exportAll = async () => {
    try {
      await exportDataAndSave("transaction_tables");
      await exportDataAndSave("products_table");
      await exportDataAndSave("report_table");
    } catch (error) {
      console.log("Export All Error: ", error);
    }
  };

  const generateRandomString = () => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    let randomString = "";

    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      randomString += alphabet.charAt(randomIndex);
    }

    return randomString;
  };
  const [randomLetters, setRandomLetters] = useState(() =>
    generateRandomString()
  );

  const [inputCode, setInputCode] = useState("");

  useEffect(() => {
    deleteRowsWithAllNulls();
  }, []);
  const [chosenFile, setChosenFile] = useState(null);
  const [nameFile, setNameFile] = useState(null);
  const [profit, setProfit] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const selectedReport = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "text/comma-separated-values",
    });
    const formData = new FormData();
    const assets = result.assets;
    if (!assets) return;

    const file = assets[0];

    const audioFile = {
      name: file.name.split(".")[0],
      uri: file.uri,
      type: file.mimeType,
      size: file.size,
    };

    const totalRecords = 100; // Replace with the actual total number of records to insert
    const recordsPerChunk = 10; // Adjust the number of records per chunk based on your needs
    const totalChunks = Math.ceil(totalRecords / recordsPerChunk);

    setIsLoading(true);

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      // Simulate an asynchronous SQLite insertion operation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update progress
      const currentProgress = ((chunkIndex + 1) * 100) / totalChunks;
      setProgress(currentProgress);
    }

    setIsLoading(false);
    setProgress(0); // Reset progress after completion
    setNameFile(audioFile.name);
    console.log(audioFile.name + audioFile.type);
  };

  const handleFileSelection = async () => {
    try {
      const file = nameFile;

      const csvFilePath = FileSystem.documentDirectory + file + ".csv"; // Update the file path

      const fileInfo = await FileSystem.getInfoAsync(csvFilePath);

      if (!fileInfo.exists) {
        console.error("File does not exist:", csvFilePath);
        return;
      }

      const csvData = await FileSystem.readAsStringAsync(csvFilePath);

      if (csvData === null || csvData === undefined) {
        console.error("Failed to read CSV file:", csvFilePath);
        return;
      }

      const parsedData = Papa.parse(csvData, { header: true });

      parsedData.data.forEach(async (row) => {
        try {
          await insertReport(row);
          console.log("Report inserted successfully:", row);
        } catch (error) {
          console.error("Error during product insert:", error);
        }
      });
    } catch (error) {
      console.error("Error handling CSV file:", error);
    }
    showToastReport();
    setNameFile("");
  };

  const [ProductNameFile, setProductNameFile] = useState(null);

  const selectedProduct = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "text/comma-separated-values",
    });
    const formData = new FormData();
    const assets = result.assets;
    if (!assets) return;

    const file = assets[0];

    const audioFile = {
      name: file.name.split(".")[0],
      uri: file.uri,
      type: file.mimeType,
      size: file.size,
    };

    const totalRecords = 100; // Replace with the actual total number of records to insert
    const recordsPerChunk = 10; // Adjust the number of records per chunk based on your needs
    const totalChunks = Math.ceil(totalRecords / recordsPerChunk);

    setIsLoading(true);

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      // Simulate an asynchronous SQLite insertion operation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update progress
      const currentProgress = ((chunkIndex + 1) * 100) / totalChunks;
      setProgress(currentProgress);
    }

    setIsLoading(false);
    setProgress(0); // Reset progress after completion
    setProductNameFile(audioFile.name);
    console.log(audioFile.name + audioFile.type);
  };

  const handleFileProduct = async () => {
    try {
      const file = ProductNameFile;

      const csvFilePath = FileSystem.documentDirectory + file + ".csv"; // Update the file path

      const fileInfo = await FileSystem.getInfoAsync(csvFilePath);

      if (!fileInfo.exists) {
        console.error("File does not exist:", csvFilePath);
        return;
      }

      const csvData = await FileSystem.readAsStringAsync(csvFilePath);

      if (csvData === null || csvData === undefined) {
        console.error("Failed to read CSV file:", csvFilePath);
        return;
      }

      const parsedData = Papa.parse(csvData, { header: true });

      parsedData.data.forEach(async (row) => {
        try {
          await insertProduct(row);
          console.log("Product inserted successfully:", row);
        } catch (error) {
          console.error("Error during product insert:", error);
        }
      });
    } catch (error) {
      console.error("Error handling CSV file:", error);
    }
    showToastProduct();
    setProductNameFile("");
  };

  const [transactionName, setTransactionName] = useState(null);

  const selectedTransaction = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "text/comma-separated-values",
    });
    const formData = new FormData();
    const assets = result.assets;
    if (!assets) return;

    const file = assets[0];

    const audioFile = {
      name: file.name.split(".")[0],
      uri: file.uri,
      type: file.mimeType,
      size: file.size,
    };

    const totalRecords = 100; // Replace with the actual total number of records to insert
    const recordsPerChunk = 10; // Adjust the number of records per chunk based on your needs
    const totalChunks = Math.ceil(totalRecords / recordsPerChunk);

    setIsLoading(true);

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      // Simulate an asynchronous SQLite insertion operation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update progress
      const currentProgress = ((chunkIndex + 1) * 100) / totalChunks;
      setProgress(currentProgress);
    }

    setIsLoading(false);
    setProgress(0); // Reset progress after completion
    setTransactionName(audioFile.name);
    console.log(audioFile.name + audioFile.type);
  };

  const handleFileTransaction = async () => {
    try {
      const file = transactionName;

      const csvFilePath = FileSystem.documentDirectory + file + ".csv"; // Update the file path

      const fileInfo = await FileSystem.getInfoAsync(csvFilePath);

      if (!fileInfo.exists) {
        console.error("File does not exist:", csvFilePath);
        return;
      }

      const csvData = await FileSystem.readAsStringAsync(csvFilePath);

      if (csvData === null || csvData === undefined) {
        console.error("Failed to read CSV file:", csvFilePath);
        return;
      }

      const parsedData = Papa.parse(csvData, { header: true });

      parsedData.data.forEach(async (row) => {
        try {
          await insertReceipt(row);
          console.log("Report inserted successfully:", row);
        } catch (error) {
          console.error("Error during product insert:", error);
        }
      });
    } catch (error) {
      console.error("Error handling CSV file:", error);
    }
    showToastReceipts();
    setTransactionName("");
  };

  return (
    <View style={styles.scannerui} {...panResponder.panHandlers}>
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
            SECURITY
          </Text>
        </View>
      </View>

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: "80%",
          width: "100%",
        }}
      >
        <View>
          <Text style={{ fontFamily: "DMSansLight", right: 30, margin: 10 }}>
            Backup all Receipts?
          </Text>
          <TouchableOpacity
            onPress={() => exportDataTo("transaction_tables")}
            style={{
              elevation: 5,
              width: 220,
              height: 80,
              backgroundColor: "#D9D9D9",
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontFamily: "DMSansBold", fontSize: 13 }}>
              DOWNLOAD ALL RECEIPTS
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text
            style={{
              fontFamily: "DMSansLight",
              right: 30,
              margin: 10,
              marginTop: 20,
            }}
          >
            Backup all Reports?
          </Text>
          <TouchableOpacity
            onPress={() => exportDataTo("report_table")}
            style={{
              elevation: 5,
              width: 220,
              height: 80,
              backgroundColor: "#D9D9D9",
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontFamily: "DMSansBold", fontSize: 13 }}>
              DOWNLOAD ALL REPORTS
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text
            style={{
              fontFamily: "DMSansLight",
              right: 30,
              margin: 10,
              marginTop: 20,
            }}
          >
            Backup Products Inventory?
          </Text>
          <TouchableOpacity
            onPress={() => exportDataTo("products_table")}
            style={{
              elevation: 5,
              width: 220,
              height: 80,
              backgroundColor: "#D9D9D9",
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontFamily: "DMSansBold", fontSize: 13 }}>
              DOWNLOAD INVENTORY
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            justifyContent: "flex-start",
            alignItems: "flex-end",
            width: "100%",
            top: 30,
            right: 30,
          }}
        >
          <Text
            style={{
              fontFamily: "DMSansBold",
              fontSize: 10,
              marginBottom: 5,
              right: 25,
            }}
          >
            Insert Existing Data
          </Text>
          <View>
            <TouchableOpacity
              onPress={() => {
                setInsertData(true);
              }}
              style={{
                elevation: 5,
                width: 130,
                height: 30,
                borderWidth: 0.5,
                backgroundColor: "#D9D9D9",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontFamily: "DMSansBold", fontSize: 9 }}>
                Insert
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                onPress={closeModal}
                style={{ alignSelf: "flex-end", marginBottom: 20 }}
              >
                <Image
                  source={require("./cancel.png")}
                  style={{
                    height: 20,
                    width: 20,
                    shadowColor: "#d9d9d9",
                    shadowOffset: { width: 0, height: 0 },
                    shadowRadius: 5,
                  }}
                ></Image>
              </TouchableOpacity>
              <Text style={{ fontFamily: "DMSansBold", fontSize: 25 }}>
                DELETE ALL DATA
              </Text>
              <Text style={{ fontFamily: "DMSansBold", margin: 10 }}>
                Enter Security Code
              </Text>
              <Text style={{ marginBottom: 5, fontFamily: "DMSansLight" }}>
                {randomLetters}
              </Text>
              <TextInput
                value={inputCode}
                onChangeText={(text) => {
                  setInputCode(text);
                }}
                style={{ width: 100, borderWidth: 0.5 }}
              />
              <TouchableOpacity
                disabled={inputCode != randomLetters}
                style={{
                  width: 100,
                  padding: 5,
                  backgroundColor:
                    inputCode !== randomLetters ? "#A9A9A9" : "#ED254E", // Different color when disabled
                  marginTop: 20,
                  borderRadius: 50,
                }}
                onPress={deleteAllData}
              >
                <Text
                  style={{
                    fontFamily: "DMSansRegular",
                    fontSize: 10,
                    textAlign: "center",
                  }}
                >
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={insertData} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                onPress={() => {
                  setInsertData(false);
                }}
                style={{ alignSelf: "flex-end" }}
              >
                <Image
                  source={require("./cancel.png")}
                  style={{
                    height: 20,
                    width: 20,
                    shadowColor: "#d9d9d9",
                    shadowOffset: { width: 0, height: 0 },
                    shadowRadius: 5,
                  }}
                ></Image>
              </TouchableOpacity>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 50,
                }}
              >
                <Text
                  style={{
                    fontFamily: "DMSansRegular",
                    alignSelf: "flex-start",
                  }}
                >
                  Insert Products
                </Text>
                <View style={{ flexDirection: "row", marginBottom: 15 }}>
                  <TouchableOpacity
                    onPress={selectedProduct}
                    style={{
                      margin: 5,
                      width: 150,
                      height: 30,
                      backgroundColor: "#d9d9d9",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontFamily: "DMSansLight", fontSize: 10 }}>
                      {ProductNameFile}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={ProductNameFile == 0}
                    onPress={handleFileProduct}
                    style={{
                      margin: 5,
                      width: 70,
                      height: 30,
                      backgroundColor:
                        ProductNameFile === 0 ? "#ED254E" : "#d9d9d9",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 50,
                    }}
                  >
                    <Text style={{ fontFamily: "DMSansLight", fontSize: 10 }}>
                      Insert
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text
                  style={{
                    fontFamily: "DMSansRegular",
                    alignSelf: "flex-start",
                  }}
                >
                  Insert Report
                </Text>
                <View style={{ flexDirection: "row", marginBottom: 15 }}>
                  <TouchableOpacity
                    onPress={selectedReport}
                    style={{
                      margin: 5,
                      width: 150,
                      height: 30,
                      backgroundColor: "#d9d9d9",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontFamily: "DMSansLight", fontSize: 10 }}>
                      {nameFile}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleFileSelection}
                    disabled={nameFile == 0}
                    style={{
                      margin: 5,
                      width: 70,
                      height: 30,
                      backgroundColor: nameFile == 0 ? "#ED254E" : "#d9d9d9",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 50,
                    }}
                  >
                    <Text style={{ fontFamily: "DMSansLight", fontSize: 10 }}>
                      Insert
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text
                  style={{
                    fontFamily: "DMSansRegular",
                    alignSelf: "flex-start",
                  }}
                >
                  Insert Receipt
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    onPress={selectedTransaction}
                    style={{
                      margin: 5,
                      width: 150,
                      height: 30,
                      backgroundColor: "#d9d9d9",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontFamily: "DMSansLight", fontSize: 10 }}>
                      {transactionName}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleFileTransaction}
                    disabled={transactionName == 0}
                    style={{
                      margin: 5,
                      width: 70,
                      height: 30,
                      backgroundColor:
                        transactionName === 0 ? "#ED254E" : "#d9d9d9",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 50,
                    }}
                  >
                    <Text style={{ fontFamily: "DMSansLight", fontSize: 10 }}>
                      Insert
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
              {progress > 0 && (
                <Text>{`Progress: ${progress.toFixed(2)}%`}</Text>
              )}
            </View>
          </View>
        </Modal>
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
  touchArea: {
    width: 200,
    height: 200,
    backgroundColor: "lightgray",
  },
});

export default Map;
