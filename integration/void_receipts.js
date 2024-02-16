import { db } from "../screens/DatabaseHelper";

export const VoidReceipts = () =>{
    db.transaction((tx)=>{
        //Products Table
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS voidreceipts_tables (receipt_no, code, name, price, quantity, total_amount, recieved, grand_total, date, time);',
        [],
        () => {
          console.log('New Voids Table Added');
        },
        (_, error) => {
          console.error('Error creating database and table for Transaction Table: ', error);
        }
      );
    })
}

export const rollbackTransaction = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM transaction_tables ORDER BY transaction_Id DESC LIMIT 1;',
        [],
        (_, { rows }) => {
          const latestTransaction = rows._array[0];

          if (latestTransaction) {
            tx.executeSql(
              'DELETE FROM transaction_tables WHERE transaction_Id = ?;',
              [latestTransaction.transaction_Id],
              (_, { rowsAffected }) => {
                console.log(`${rowsAffected} records deleted from transaction_tables`);

                tx.executeSql(
                  'INSERT INTO voidreceipts_tables (receipt_no, code, name, price, quantity, total_amount, recieved, grand_total, date, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
                  [
                    latestTransaction.receipt_no,
                    latestTransaction.code,
                    latestTransaction.name,
                    latestTransaction.price,
                    latestTransaction.quantity,
                    latestTransaction.total_amount,
                    latestTransaction.recieved,
                    latestTransaction.grand_total,
                    latestTransaction.date,
                    latestTransaction.time,
                  ],
                  (_, { insertId }) => {
                    console.log(`Record inserted into voidreceipts_table with ID: ${insertId}`);
                    resolve('Transaction rolled back successfully');
                  },
                  (_, error) => {
                    console.error('Error inserting record into voidreceipts_table:', error);
                    reject('Error inserting record into voidreceipts_table');
                  }
                );
              },
              (_, error) => {
                console.error('Error deleting latest record from transaction_tables:', error);
                reject('Error deleting latest record from transaction_tables');
              }
            );
          } else {
            console.log('No records found to delete');
            resolve('No records found to delete');
          }
        },
        (_, error) => {
          console.error('Error fetching latest record from transaction_tables:', error);
          reject('Error fetching latest record from transaction_tables');
        }
      );
    });
  });
}

export const getVoidReceipts = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM voidreceipts_tables;',
        [],
        (_, { rows }) => {
          const voidReceipts = rows._array;
          resolve(voidReceipts);
        },
        (_, error) => {
          console.error('Error fetching void receipts:', error);
          reject(error);
        }
      );
    });
  });
};


export const getVoidReceiptsByReceiptNo = (receiptNo) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM voidreceipts_tables WHERE receipt_no = ?;',
        [receiptNo], // Provide the receipt number as a parameter
        (_, { rows }) => {
          const voidReceipts = rows._array;
          resolve(voidReceipts);
        },
        (_, error) => {
          console.error('Error fetching void receipts:', error);
          reject(error);
        }
      );
    });
  });
};
