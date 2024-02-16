import { db } from "../screens/DatabaseHelper";
export const deleteRowsWithAllNulls = () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM report_table WHERE (net_sales IS NULL OR net_sales = 0) AND (total_cost IS NULL OR total_cost = 0) AND (profit IS NULL OR profit = 0)',
          [],
          (_, result) => {
            console.log('Deleted rows with all null or zero values:', result);
            resolve(result);
          },
          (_, error) => {
            console.error('Error deleting rows with all null or zero values:', error);
            reject(error);
          }
        );
      });
    });
  };
  

  
export const insertReport = (reportData) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        // Delete rows with all values being either zero or null before inserting
        tx.executeSql(
          'DELETE FROM report_table WHERE date = ? AND (net_sales = 0 OR net_sales IS NULL) AND (total_cost = 0 OR total_cost IS NULL) AND (profit = 0 OR profit IS NULL)',
          [reportData.date],
          (_, deleteResult) => {
            console.log('Deleted rows with all zero or null values:', deleteResult);
  
            // Insert the new row
            tx.executeSql(
              'INSERT INTO report_table (date, net_sales, total_cost, profit) VALUES (?, ?, ?, ?)',
              [reportData.date, reportData.net_sales, reportData.total_cost, reportData.profit],
              (_, insertResult) => {
                console.log('Inserted new row:', insertResult);
                resolve(insertResult);
              },
              (_, insertError) => {
                reject(insertError);
              }
            );
          },
          (_, deleteError) => {
            reject(deleteError);
          }
        );
      });
    });
  };

  export const insertProduct = (productData) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        // Check and set default values for properties that might be undefined
        const code = productData.code || null;
        const name = productData.name || null;
        const original_quantity = productData.original_quantity;
        const quantity = productData.quantity;
        const unit = productData.unit;
        const cost = productData.cost;
        const srp = productData.srp;
        const warninglevel = productData.warninglevel;
        const expiry_date = productData.expiry_date;
        const location = productData.location;
        const purchase_date = productData.purchase_date;
        const contact = productData.contact;
        const category = productData.category;
  
        tx.executeSql(
          'INSERT INTO products_table (code, name, original_quantity, quantity, unit, cost, srp, warninglevel, expiry_date, location, purchase_date, contact, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
          [
            code,
            name,
            original_quantity,
            quantity,
            unit,
            cost,
            srp,
            warninglevel,
            expiry_date,
            location,
            purchase_date,
            contact,
            category,
          ],
          (_, insertResult) => {
            console.log('Inserted new row:', insertResult);
            resolve(insertResult);
          },
          (_, insertError) => {
            console.error('Error during product inserts:', insertError);
            reject(insertError);
          }
        );
      });
    });
  };
  
  
  
  export const insertReceipt = (transactionData) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        // Insert the new row into products_table
        tx.executeSql(
          'INSERT INTO transaction_tables (receipt_no, code, name, price, quantity,  total_amount, recieved, grand_total, date, time) VALUES (?,?,?,?,?,?,?,?,?,?);',
          [
            transactionData.receipt_no,
            transactionData.code,
            transactionData.name,
            transactionData.price,
            transactionData.quantity,
            transactionData.total_amount,
            transactionData.recieved,
            transactionData.grand_total,
            transactionData.date,
            transactionData.time,
          ],
          (_, insertResult) => {
            console.log('Inserted new row:', insertResult);
            resolve(insertResult);
          },
          (_, insertError) => {
            reject(insertError);
          }
        );
      });
    });
  };