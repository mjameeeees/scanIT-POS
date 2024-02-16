import * as SQLite from 'expo-sqlite';
import moment from 'moment';


export const db = SQLite.openDatabase('storeproducts.db');


export const deleteAll = () => {
  db.transaction((tx) => {
    tx.executeSql('DELETE FROM products', [], (_, result) => {
      // Handle the success of the delete operation
      console.log('All items deleted from the table.');
    },
    (error) => {
      // Handle any errors that occur during the delete operation
      console.error('Error deleting items from the table:', error);
    });


    tx.executeSql('DELETE FROM transactions_table_final', [], (_, result) => {
      // Handle the success of the delete operation
      console.log('All items deleted from the transcations.');
    },
    (error) => {
      // Handle any errors that occur during the delete operation
      console.error('Error deleting items from the table:', error);
    });

    tx.executeSql('DELETE FROM sales_table', [], (_, result) => {
      // Handle the success of the delete operation
      console.log('All items deleted from the transcations.');
    },
    (error) => {
      // Handle any errors that occur during the delete operation
      console.error('Error deleting items from the table:', error);
    });

    tx.executeSql('DELETE FROM bestproducts_table', [], (_, result) => {
      // Handle the success of the delete operation
      console.log('All items deleted from the transcations.');
    },
    (error) => {
      // Handle any errors that occur during the delete operation
      console.error('Error deleting items from the table:', error);
    });
    
  });
} 

export const deleteTransactionTable = (transactionid) => {
  db.transaction((tx) => {
    tx.executeSql('DELETE FROM transactions_table_final WHERE transactionid = ?', [transactionid], (_, result) => {
      // Handle the success of the delete operation
      console.log('All items deleted from the transcations.');
    },
    (error) => {
      // Handle any errors that occur during the delete operation
      console.error('Error deleting items from the table:', error);
    });
    
  });
} 
 

//Creating Database and Table
export const createDatabase = () => {
  db.transaction(
    (tx) => {
      tx.executeSql('PRAGMA foreign_keys = ON;', [], () => {
        console.log('Foreign key support enabled');
      });


      //Products Table
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS products ( product_Id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT NOT NULL, name TEXT NOT NULL, quantity INTEGER NOT NULL,category TEXT, price REAL NOT NULL,profit REAL NOT NULL, total_amount REAL, productprice REAL NOT NULL,expiry_date TEXT, unit TEXT);',
        [],
        () => {
          console.log('Product Table Added');
        },
        (_, error) => {
          console.error('Error creating database and table: ', error);
        }
      );

      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS out_of_stocks ( product_Id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT NOT NULL, name TEXT NOT NULL, quantity REAL, category TEXT);',
        [],
        () => {
          console.log('Product Table Added Out Of Stock');
        },
        (_, error) => {
          console.error('Error creating database and table: ', error);
        }
      );

      //Transaction Table

      //Transaction Table
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS transactions_table_final (id INTEGER PRIMARY KEY,transactionid INTEGER,product_Id INTEGER, code TEXT,name TEXT,quantity INTEGER,price REAL,profit REAL,total_amount REAL,expirydate TEXT,productprice REAL,category TEXT);',
        [],
        () => {
          console.log('transactions_table_final Table Added');
        },
        (_, error) => {
          console.error('Error creating database and table: ', error);
        }
      );

      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS sales_table (id INTEGER PRIMARY KEY, transactionid INTEGER, gross_sales REAL, net_sales REAL, transactiondate TEXT);',
        [],
        () => {
          console.log('sales_table Table Added');
        },
        (_, error) => {
          console.error('Error creating database and table: ', error);
        }
      );

      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS bestproducts_table (id INTEGER PRIMARY KEY, name TEXT, category TEXT, sold_products REAL);',
        [],
        () => {
          console.log('Best Product Table Added');
        },
        (_, error) => {
          console.error('Error creating database and table: ', error);
        }
      );
    },
    null,
    null
  );
};

