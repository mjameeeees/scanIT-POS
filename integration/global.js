import { db } from "../screens/DatabaseHelper";

import { ToastAndroid } from "react-native";
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const deleteAll = () => {
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM report_table', [], (_, result) => {
        // Handle the success of the delete operation
        console.log('All items deleted from the table.');
      },
      (error) => {
        // Handle any errors that occur during the delete operation
        console.error('Error deleting items from the table:', error);
      }); 

      tx.executeSql('DELETE FROM products_table', [], (_, result) => {
        // Handle the success of the delete operation
        console.log('All items deleted from the table.');
      },
      (error) => {
        // Handle any errors that occur during the delete operation
        console.error('Error deleting items from the table:', error);
      }); 

      tx.executeSql('DELETE FROM outofstocks_table', [], (_, result) => {
        // Handle the success of the delete operation
        console.log('All items deleted from the table.');
      },
      (error) => {
        // Handle any errors that occur during the delete operation
        console.error('Error deleting items from the table:', error);
      }); 

      tx.executeSql('DELETE FROM transaction_tables', [], (_, result) => {
        // Handle the success of the delete operation
        console.log('All items deleted from the table.');
      },
      (error) => {
        // Handle any errors that occur during the delete operation
        console.error('Error deleting items from the table:', error);
      }); 

      tx.executeSql('DELETE FROM bestseller_table', [], (_, result) => {
        // Handle the success of the delete operation
        console.log('All items deleted from the table.');
      },
      (error) => {
        // Handle any errors that occur during the delete operation
        console.error('Error deleting items from the table:', error);
      }); 

      tx.executeSql('DELETE FROM expiredproducts_table', [], (_, result) => {
        // Handle the success of the delete operation
        console.log('All items deleted from the table.');
      },
      (error) => {
        // Handle any errors that occur during the delete operation
        console.error('Error deleting items from the table:', error);
      }); 

      tx.executeSql('DELETE FROM voidreceipts_tables', [], (_, result) => {
        // Handle the success of the delete operation
        console.log('All items deleted from the table.');
      },
      (error) => {
        // Handle any errors that occur during the delete operation
        console.error('Error deleting items from the table:', error);
      }); 


    });
  } 

  export const exportDataTo = (tableName) => {
    const formatDataAsCsv = (data) => {
       let csvData = '';
       let headers = Object.keys(data[0]).join(',') + '\n';
       csvData += headers;
   
       data.forEach((row) => {
         let values = Object.values(row).join(',');
         csvData += values + '\n';
       });
   
       return csvData;
    };
   

    db.transaction(
       (tx) => {
         ToastAndroid.show(`Open ${tableName}` , ToastAndroid.SHORT);
   
         tx.executeSql(
           `SELECT * FROM ${tableName}`,
           [],
           (_, { rows }) => {
             const csvData = formatDataAsCsv(rows._array);
   
             FileSystem.writeAsStringAsync(
               FileSystem.documentDirectory + `${tableName}.csv`,
               csvData,
               { encoding: FileSystem.EncodingType.UTF8 }
             ).then(() => {
               Sharing.shareAsync(
                 FileSystem.documentDirectory + `${tableName}.csv`
               );
             });
           }
         );
       },
       null,
       (error) => {
         console.log('Transaction error: ', error);
       }
    );
   };

  

  export const exportDataAndSave = async (tableName) => {
    try {
        // Assuming exportDataTo returns the data to be exported
        const data = await exportDataTo(tableName);

        // Save the data to a CSV file
        const fileUri = `${FileSystem.documentDirectory}${tableName}.csv`;
        await FileSystem.writeAsStringAsync(fileUri, data, { encoding: FileSystem.EncodingType.UTF8 });

        // Move the file to a specific directory in the file system (e.g., File Manager)
        const destinationUri = `${FileSystem.documentDirectory}FileManager/${tableName}.csv`;
        await FileSystem.moveAsync({ from: fileUri, to: destinationUri });

        // Share the file using Expo Sharing
        await Sharing.shareAsync(destinationUri);
    } catch (error) {
        console.log(`Export and Save Error for ${tableName}: `, error);
    }
};

export const fetchAllData = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM products_table;',
        [],
        (_, { rows }) => {
          const bestsellerData = rows._array;
          resolve(bestsellerData);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};