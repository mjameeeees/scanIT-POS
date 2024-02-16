import { db } from "../screens/DatabaseHelper";

  export const getAllTransactionsByReceiptNo = () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM transaction_tables;',
          [],
          (_, { rows }) => {
            // Successfully retrieved data
            const data = rows._array; // Extract the data from the rows object
            resolve(data);
          },
          (_, error) => {
            // Error occurred while executing the SQL query
            console.error('Error fetching data from transaction_tables:', error);
            reject(error);
          }
        );
      });
    });
  };

  export const getLatestInTransactionByReceiptNo = (receiptNo) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM transaction_tables WHERE receipt_no = ? ORDER BY date DESC, time DESC;',
          [receiptNo],
          (_, { rows }) => {
            // Successfully retrieved data
            const transactions = rows.length > 0 ? rows._array : [];
            resolve(transactions);
          },
          (_, error) => {
            // Error occurred while executing the SQL query
            console.error('Error fetching data from transaction_tables:', error);
            reject(error);
          }
        );
      });
    });
  
  };

  export const getAllUniqueTransactionIds = () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT DISTINCT receipt_no, date, time FROM transaction_tables ORDER BY date ASC, time ASC;',
          [],
          (_, { rows }) => {
            // Successfully retrieved unique transactionids
            const uniqueTransactionIds = rows._array.map((row) => ({
              receipt_no: row.receipt_no,
              date: row.date,
              time: row.time,
            }));
  
            resolve(uniqueTransactionIds.reverse());
          },
          (_, error) => {
            // Error occurred while executing the SQL query
            console.error('Error fetching unique transactionids:', error);
            reject(error);
          }
        );
      });
    });
  };

  export const getLatestTransactionDetails = () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM transaction_tables ORDER BY transaction_Id DESC LIMIT 1;',
          [],
          (_, { rows }) => {
            const latestTransaction = rows.item(0); // Extract the entire row from the result
            resolve(latestTransaction);
          },
          (_, error) => {
            console.error('Error fetching latest transaction details:', error);
            reject(error);
          }
        );
      });
    });
  };