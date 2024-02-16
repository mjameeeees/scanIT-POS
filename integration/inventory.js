import { db } from "../screens/DatabaseHelper";

export const InventoryTable = () =>{
    db.transaction((tx)=>{
        //Products Table
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS inventory_table ( product_Id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT, name TEXT, original_quantity INTEGER, quantity INTEGER, unit TEXT, cost REAL, srp REAL, warninglevel INTEGER, expiry_date TEXT, location TEXT, purchase_date TEXT, contact INTEGER, category TEXT);",
        [],
        () => {
          console.log('New Out of Inventory Table Added');
        },
        (_, error) => {
          console.error('Error creating Inventory Table: ', error);
        }
      );
    })
}

export const insertInventoryProduct = (
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
          'INSERT INTO inventory_table (code, name, quantity, original_quantity, unit, cost, srp, warninglevel, expiry_date, location, purchase_date, contact, category ) VALUES (?, ?, ?,?,?,?,?,?,?,?,?,?,?);',
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
            console.log('Inserted in Inventory');
          },
          (_, error) => {
            console.error('Error inserting product info into inventory_table: ', error);
          }
        );
      },
      null,
      null
    );
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
  
  
  export const fetchInventoryProducts = async () => {
  
    try {
      return await new Promise((resolve, reject) => {
        db.transaction(
          async (tx) => {
            const results = await executeSqlAsync(tx, "SELECT * FROM inventory_table", []);
  
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
