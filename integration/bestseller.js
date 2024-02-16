import { db } from "../screens/DatabaseHelper";

export const BestSellersProduct = () =>{
    db.transaction((tx)=>{
        //Products Table
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS bestseller_table ( product_Id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT NOT NULL, name TEXT NOT NULL, original_quantity INTEGER NOT NULL, quantity INTEGER NOT NULL, unit TEXT, cost REAL, srp REAL, warninglevel INTEGER, expiry_date TEXT, location TEXT, purchase_date TEXT, contact INTEGER, category TEXT);',
        [],
        () => {
          console.log('New Best Products Table Added');
        },
        (_, error) => {
          console.error('Error creating Out of Stocks Table: ', error);
        }
      );
    })
}


export const insertBestProduct = (
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

  originalQuantity = quantity;
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO bestseller_table (code, name, original_quantity, quantity, unit, cost, srp, warninglevel, expiry_date, location, purchase_date, contact, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        code,
        name,
        originalQuantity,
        quantity,
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
      (_, { insertId, rowsAffected }) => {
        if (rowsAffected > 0) {
          console.log('Product inserted successfully Best Buy!');
        } else {
          console.error('Error inserting best product. No rows affected.');
        }
      },
      (_, error) => {
        console.error('Error inserting best product:', error);
      }
    );
  });
};


export const fetchBestsellerData = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT name, category, SUM(quantity) as totalQuantity FROM bestseller_table GROUP BY name, category;',
        [],
        (_, { rows }) => {
          const bestsellerData = rows._array;
          resolve(bestsellerData);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

export const fetchLargestProduct = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT *, SUM(quantity) as totalQuantity FROM bestseller_table GROUP BY name, category ORDER BY totalQuantity DESC LIMIT 1;',
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