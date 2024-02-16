import { db } from "../screens/DatabaseHelper";

export const getProductsBelowWarningLevel = () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT
            code,
            name,
            quantity,
            original_quantity,
            unit,
            cost,
            srp,
            warninglevel,
            expiry_date,
            location,
            purchase_date,
            contact,
            category
          FROM
            products_table
          WHERE
            quantity <= warninglevel;`,
          [],
          (_, { rows }) => {
            const products = rows._array;
            resolve(products);
          },
          (_, error) => {
            console.error('Error fetching products below warning level:', error);
            reject(error);
          }
        );
      });
    });
  };

  export const getLatestLowProducts = () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT
            code,
            name,
            quantity,
            original_quantity,
            unit,
            cost,
            srp,
            warninglevel,
            expiry_date,
            location,
            purchase_date,
            contact,
            category
          FROM
            products_table
          WHERE
            quantity <= warninglevel
          ORDER BY
            purchase_date DESC
          LIMIT 1;`,
          [],
          (_, { rows }) => {
            const lowProduct = rows._array[0];
            resolve(lowProduct);
          },
          (_, error) => {
            console.error('Error fetching latest low product:', error);
            reject(error);
          }
        );
      });
    });
  };