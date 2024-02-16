import { db } from "../screens/DatabaseHelper";
import moment from "moment";

  export const ExpiredProducts = () =>{
    db.transaction((tx)=>{
        //Products Table
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS expiredproducts_table ( product_Id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT NOT NULL, name TEXT NOT NULL, original_quantity INTEGER NOT NULL, quantity INTEGER NOT NULL, unit TEXT, cost REAL, srp REAL, warninglevel INTEGER, expiry_date TEXT, location TEXT, purchase_date TEXT, contact INTEGER, category TEXT);',
        [],
        () => {
          console.log('New Out of Stocks Table Added');
        },
        (_, error) => {
          console.error('Error creating Out of Stocks Table: ', error);
        }
      );
    })
  }

  export const getExpiredProducts = () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM expiredproducts_table;',
          [],
          (_, { rows }) => {
            const outOfStocksProducts = rows._array;
            resolve(outOfStocksProducts);
          },
          (_, error) => {
            console.error('Error fetching out of stocks products:', error);
            reject(error);
          }
        );
      });
    });
  };

  export const moveExpiredProductsToOutOfStocks = () => {
    return new Promise((resolve, reject) => {
      const formattedCurrentDate = moment().format('YYYY-MM-DD');
      db.transaction(
        (tx) => {
          // Fetch and delete expired products
          tx.executeSql(
            'SELECT * FROM products_table WHERE expiry_date < ?;',
            [formattedCurrentDate],
            (_, { rows }) => {
              const expiredProducts = rows._array;
  
              // Delete expired products from products_table
              tx.executeSql(
                'DELETE FROM products_table WHERE expiry_date < ?;',
                [formattedCurrentDate],
                (_, deleteResult) => {
                  if (deleteResult.rowsAffected > 0) {
                    // Insert expired products into outofstocks_table and expired_products table
                    expiredProducts.forEach((product) => {
                      // Insert into outofstocks_table
                      tx.executeSql(
                        'INSERT INTO outofstocks_table (code, name, original_quantity, quantity, unit, cost, srp, warninglevel, expiry_date, location, purchase_date, contact, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
                        [
                          product.code,
                          product.name,
                          product.original_quantity,
                          product.quantity,
                          product.unit,
                          product.cost,
                          product.srp,
                          product.warninglevel,
                          product.expiry_date,
                          product.location,
                          product.purchase_date,
                          product.contact,
                          product.category,
                        ],
                        (_, outofstocksInsertResult) => {
                          // Successfully inserted into outofstocks_table
                          console.log('Moved expired product to outofstocks_table:', product);
  
                          // Insert into expired_products table
                          tx.executeSql(
                            'INSERT INTO expired_products (code, name, original_quantity, quantity, unit, cost, srp, warninglevel, expiry_date, location, purchase_date, contact, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
                            [
                              product.code,
                              product.name,
                              product.original_quantity,
                              product.quantity,
                              product.unit,
                              product.cost,
                              product.srp,
                              product.warninglevel,
                              product.expiry_date,
                              product.location,
                              product.purchase_date,
                              product.contact,
                              product.category,
                            ],
                            (_, expiredProductsInsertResult) => {
                              // Successfully inserted into expired_products table
                              console.log('Inserted expired product into expired_products table:', product);
                            },
                            (_, error) => {
                              console.error('Error inserting into expired_products table:', error);
                              reject(error);
                            }
                          );
                        },
                        (_, error) => {
                          console.error('Error inserting into outofstocks_table:', error);
                          reject(error);
                        }
                      );
                    });
  
                    resolve(expiredProducts);
                  } else {
                    // No expired products found
                    resolve([]);
                  }
                },
                (_, error) => {
                  console.error('Error deleting expired products:', error);
                  reject(error);
                }
              );
            },
            (_, error) => {
              console.error('Error fetching expired products:', error);
              reject(error);
            }
          );
        },
        (error) => {
          console.error('Transaction error:', error);
          reject(error);
        },
        () => {
          // Transaction completed
        }
      );
    });
  };
  
  export const getLatestExpiringProduct = () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM products_table
          WHERE expiry_date IS NOT NULL AND expiry_date <> ''
          ORDER BY expiry_date ASC
          LIMIT 1;`,
          [],
          (_, { rows }) => {
            const latestExpiringProduct = rows._array[0];
            resolve(latestExpiringProduct);
          },
          (_, error) => {
            console.error('Error fetching latest expiring product:', error);
            reject(error);
          }
        );
      });
    });
  };

  export const getProductsExpiringIn7Days = () => {
    return new Promise((resolve, reject) => {
      // Calculate the date 7 days from now using moment
      const sevenDaysFromNow = moment().add(7, 'days').toISOString();
  
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM products_table
          WHERE expiry_date IS NOT NULL AND expiry_date <> ''
          AND date(expiry_date) <= date(?)
          ORDER BY expiry_date ASC;`,
          [sevenDaysFromNow],
          (_, { rows }) => {
            const expiringProducts = rows._array;
            resolve(expiringProducts);
          },
          (_, error) => {
            console.error('Error fetching expiring products:', error);
            reject(error);
          }
        );
      });
    });
  };

