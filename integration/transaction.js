import { db } from "../screens/DatabaseHelper";

export const Transactions = () =>{
    db.transaction((tx)=>{
        //Products Table
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS transaction_tables ( transaction_Id INTEGER PRIMARY KEY AUTOINCREMENT, receipt_no INTEGER, code TEXT, name TEXT, price REAL, quantity INTEGER,total_amount REAL, recieved REAL,grand_total REAL, date TEXT,time TEXT);',
        [],
        () => {
          console.log('New Transaction Table Added');
        },
        (_, error) => {
          console.error('Error creating database and table for Transaction Table: ', error);
        }
      );
    })
}


export const insertTransactionItems = (receipt_no, code, name, price, quantity, total_amount, recieved, grand_total, date, time) => {
  db.transaction(
    (tx) => {
      // Fetch the current quantity of the product
      tx.executeSql(
        'SELECT quantity FROM products_table WHERE code  = ?;',
        [code],
        (_, { rows }) => {
          const currentQuantity = rows.length > 0 ? rows.item(0).quantity : 0;

          // Check if there is enough quantity available
          if (currentQuantity >= quantity) {
            // Insert the transaction into transactions_table_final
            tx.executeSql(
              'INSERT INTO transaction_tables (receipt_no, code, name, price, quantity,  total_amount, recieved, grand_total, date, time) VALUES (?,?,?,?,?,?,?,?,?,?);',
              [receipt_no, code, name, price, quantity, total_amount, recieved, grand_total, date, time],
              (_, result) => {
                console.log('Inserted in Table Transaction');

                // Calculate the new quantity after the transaction
                const newQuantity = currentQuantity - quantity;

                // Update the products table with the new quantity
                tx.executeSql(
                  'UPDATE products_table SET quantity = ? WHERE code = ?;',
                  [newQuantity, code],
                  (_, result) => {
                    console.log(`Updated product quantity for ${code} to ${newQuantity}`);
                  },
                  (_, error) => {
                    console.error('Error updating product quantity:', error);
                  }
                );
              },
              (_, error) => {
                console.error('Error inserting product info into Transaction Table: ', error);
              }
            );
          }
        }
      );
    },
    null,
    null
  );
};

export const fetchProductDetailsFromDatabaseByName = (name) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'SELECT * FROM products_table WHERE name LIKE ?;', // Use % for wildcard search
          [name],
          (_, { rows }) => {
            const product = rows.item(0); // Get the first (and hopefully only) result
            if (product) {
              resolve(product); // Resolve with the product details
            } else {
              resolve(null); // Resolve with null if the product is not found
            }
          },
          (_, error) => {
            console.error('Error fetching product details:', error);
            reject(error); // Reject with the error if there's an issue
          }
        );
      },
      null,
      null
    );
  });
};
