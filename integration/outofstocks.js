import { db } from "../screens/DatabaseHelper";
import moment from "moment";

export const OutOfStocks = () =>{
    db.transaction((tx)=>{
        //Products Table
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS outofstocks_table ( product_Id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT NOT NULL, name TEXT NOT NULL, original_quantity INTEGER NOT NULL, quantity INTEGER NOT NULL, unit TEXT, cost REAL, srp REAL, warninglevel INTEGER, expiry_date TEXT, location TEXT, purchase_date TEXT, contact INTEGER, category TEXT);',
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

export const getProductsExpiringSoon = () => {
  return new Promise((resolve, reject) => {
    const currentDate = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(currentDate.getDate() + 7);

    const formattedCurrentDate = formatDate(currentDate);
    const formattedSevenDaysLater = formatDate(sevenDaysLater);

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM products_table WHERE expiry_date BETWEEN ? AND ?;",
        [formattedCurrentDate, formattedSevenDaysLater],
        (_, { rows }) => {
          const expiringProducts = rows._array;
          resolve(expiringProducts);
        },
        (_, error) => {
          console.error("Error fetching expiring products:", error);
          reject(error);
        }
      );
    });
  });
};

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const getExpiredProducts = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM outofstocks_table;',
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
          'SELECT * FROM products_table WHERE expiry_date = ?;',
          [formattedCurrentDate],
          (_, { rows }) => {
            const expiredProducts = rows._array;

            // Delete expired products from products_table
            tx.executeSql(
              'DELETE FROM products_table WHERE expiry_date = ?;',
              [formattedCurrentDate],
              (_, deleteResult) => {
                if (deleteResult.rowsAffected > 0) {
                  // Insert expired products into outofstocks_table and expired_products table
                  expiredProducts.forEach((product) => {
                    // Insert into outofstocks_table
                    tx.executeSql(
                      'INSERT INTO expiredproducts_table (code, name, original_quantity, quantity, unit, cost, srp, warninglevel, expiry_date, location, purchase_date, contact, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
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
                          'INSERT INTO expiredproducts_table (code, name, original_quantity, quantity, unit, cost, srp, warninglevel, expiry_date, location, purchase_date, contact, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
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

export const fetchOutOfStocksData = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM outofstocks_table;',
        [],
        (_, { rows }) => {
          const outOfStocksData = rows._array;
          resolve(outOfStocksData);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};
export const getOutOfStocksProducts = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM outofstocks_table;',
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

export const getAllTransactionsReceipt = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM outofstocks_table;',
        [],
        (_, { rows }) => {
          // Successfully retrieved data
          const data = rows._array; // Extract the data from the rows object
          resolve(data);
        },
        (_, error) => {
          // Error occurred while executing the SQL query
          console.error('Error fetching data from transactions_table_final:', error);
          reject(error);
        }
      );
    });
  });
};

export const moveOutOfStocksToTable = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO outofstocks_table
        SELECT * FROM products_table WHERE quantity = 0;
        `,
        [],
        (_, { rowsAffected }) => {
          // Delete rows with quantity zero from products_table
          if (rowsAffected > 0) {
            db.transaction((tx) => {
              tx.executeSql(
                `DELETE FROM products_table WHERE quantity = 0;`,
                [],
                (_, { rowsAffected: deletedRows }) => {
                  resolve(deletedRows);
                },
                (_, error) => {
                  reject(error);
                }
              );
            });
          } else {
            resolve(0);
          }
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};
export const getLatestOutOfStocks = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM outofstocks_table;',
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