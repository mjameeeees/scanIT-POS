import { db } from "../screens/DatabaseHelper";

export const InsertNewProductTable = () => {
  db.transaction((tx) => {
    // Create a new Products Table
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS products_table ( product_Id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT, name TEXT, original_quantity INTEGER, quantity INTEGER, unit TEXT, cost REAL, srp REAL, warninglevel INTEGER, expiry_date TEXT, location TEXT, purchase_date TEXT, contact INTEGER, category TEXT);",
      [],
      () => {
        console.log("Products Table Created or Already Exists");
      },
      (_, error) => {
        console.error("Error creating or checking the products_table: ", error);
      }
    );
  });
};

export const insertProduct = (
  code,
  name,
  quantity,
  originalQuantity,
  unit,
  cost,
  srp,
  warnQuantity,
  expiryDate,
  location,
  purchaseDate,
  contact,
  category
) => {
  
  const uppercaseName = name.toUpperCase();
  originalQuantity = quantity;
  db.transaction(
    (tx) => {
      tx.executeSql(
        'INSERT INTO products_table (code, name, quantity, original_quantity, unit, cost, srp, warninglevel, expiry_date, location, purchase_date, contact, category ) VALUES (?, ?, ?,?,?,?,?,?,?,?,?,?,?);',
        [ code,
          uppercaseName,
          quantity,
          originalQuantity,
          unit,
          cost,
          srp,
          warnQuantity,
          expiryDate,
          location,
          purchaseDate,
          contact,
          category],
        (_, result) => {
          console.log('Inserted');
        },
        (_, error) => {
          console.error('Error inserting product info into products table: ', error);
        }
      );
    },
    null,
    null
  );
};

export const fetchProducts = async () => {
  try {
    return await new Promise((resolve, reject) => {
      db.transaction(
        async (tx) => {
          const results = await executeSqlAsync(tx, "SELECT * FROM products_table", []);

          const products = [];
          for (let i = 0; i < results.rows.length; i++) {
            products.push(results.rows.item(i));
          }
          resolve(products);
          console.log(results);
        },
        // Add an error callback for the transaction
        (error) => {
          reject(error);
        }
      );
    });
  } catch (error) {
    // Handle any additional errors that might occur outside the transaction
    console.error('An error occurred during fetchProducts:', error);
    throw error; // Rethrow the error to be caught by the calling code
  }
};


const executeSqlAsync = (tx, sqlStatement, params) => {
  return new Promise((resolve, reject) => {
    tx.executeSql(
      sqlStatement,
      params,
      (tx, results) => resolve(results),
      (error) => reject(error)
    );
  });
};

export const deleteItemById = (itemId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM products_table WHERE product_Id = ?",
        [itemId],
        (_, result) => {
          console.log("Item deleted successfully");
          resolve(); // Resolve the Promise when deletion is successful
        },
        (_, error) => {
          console.error("Error deleting item:", error);
          reject(error); // Reject the Promise with an error when deletion fails
        }
      );
    });
  });
};

export const insertMultipleProducts = (products) => {
  db.transaction((tx) => {
    products.forEach((product) => {
      let [
        code,
        upperCaseName,
        quantity,
        originalQuantity,
        unit,
        cost,
        srp,
        warnQuantity,
        expiryDate,
        location,
        purchaseDate,
        contact,
        category,
      ] = product;

      // Update originalQuantity with quantity
      originalQuantity = quantity;

      // Calculate profit based on price and productprice
      // Insert the product into the database
      tx.executeSql(
        'INSERT INTO products_table (code, name, quantity, original_quantity, unit, cost, srp, warninglevel, expiry_date, location, purchase_date, contact, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          code,
          upperCaseName,
          quantity,
          originalQuantity,
          unit,
          cost,
          srp,
          warnQuantity,
          expiryDate,
          location,
          purchaseDate,
          contact,
          category,
        ],
        () => {
          console.log('Product Inserted: ', {
            code,
            upperCaseName,
            quantity,
            originalQuantity,
            unit,
            cost,
            srp,
            warnQuantity,
            expiryDate,
            location,
            purchaseDate,
            contact,
            category,
          });
        },
        (_, error) => {
          console.error('Error inserting product:', error);
        }
      );
    });
  });
};


export const getAllProductCodes = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'SELECT code FROM products_table;',
          [],
          (_, result) => {
            const productCodes = [];
            for (let i = 0; i < result.rows.length; i++) {
              productCodes.push(result.rows.item(i).code);
            }
            resolve(productCodes);
          },
          (_, error) => {
            console.error('Error fetching product codes: ', error);
            reject(error);
          }
        );
      },
      null,
      null
    );
  });
};
