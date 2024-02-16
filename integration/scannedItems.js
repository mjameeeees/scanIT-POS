import { db } from "../screens/DatabaseHelper";

export const fetchProductDetailsFromDatabase = (code) => {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'SELECT *, quantity AS code_quantity  FROM products_table WHERE code = ? LIMIT 1;', // Assuming "code" is the barcode column
            [code],
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

  export const fetchProductDetailsFromDatabaseByName = (code) => {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'SELECT * FROM products_table WHERE name = ? LIMIT 1;', // Assuming "code" is the barcode column
            [code],
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

  export const fetchProductDetailsFromDatabaseSuggestions = (searchTerm) => {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          let query = 'SELECT * FROM products_table';
          const params = [];
  
          // Include a WHERE clause for the search term
          if (searchTerm) {
            query += ' WHERE name LIKE ? OR code LIKE ?';
            params.push(`%${searchTerm}%`, `%${searchTerm}%`);
          }
  
          tx.executeSql(
            query,
            params,
            (_, { rows }) => {
              const products = rows._array; // Get all results as an array
              resolve(products); // Resolve with the array of product details
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