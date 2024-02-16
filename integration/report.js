import { db } from "../screens/DatabaseHelper";

export const Reports = () =>{
    db.transaction((tx)=>{
        //Products Table
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS report_table ( report_Id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, net_sales REAL,  total_cost REAL , profit REAL);',
        [],
        () => {
          console.log('New Report Table Added');
        },
        (_, error) => {
          console.error('Error creating database and table for Report Table: ', error);
        }
      );
    })
}

export const insertReport = (currentDate, initialNetSales, initialTotalCost, initialProfit) =>{
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO report_table (date, net_sales, total_cost, profit) VALUES (?, ?, ?, ?);',
      [currentDate, initialNetSales, initialTotalCost, initialProfit],
      (_, results) => {
        console.log('Initial report inserted successfully');
      },
      (_, error) => {
        console.error('Error inserting initial report:', error);
      }
    );
  });
};

export const getReports = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM report_table;',
        [],
        (_, { rows }) => {
          const reports = rows._array;
          resolve(reports);
        },
        (_, error) => {
          console.error('Error fetching reports:', error);
          reject(error);
        }
      );
    });
  });
};

export const getRecentAggregatedReport = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT date, SUM(profit) as totalProfit, SUM(net_sales) as totalNetSales, SUM(total_cost) as totalTotalCost FROM report_table GROUP BY date ORDER BY date DESC LIMIT 1;',
        [],
        (_, { rows }) => {
          const recentAggregatedReport = rows._array[0] || null;
          resolve(recentAggregatedReport);
        },
        (_, error) => {
          console.error('Error fetching recent aggregated report:', error);
          reject(error);
        }
      );
    });
  });
};



export const getRecentMonthlyAggregatedReport = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT strftime('%Y-%m', date) AS monthYear, SUM(profit) as totalProfit, SUM(net_sales) as totalNetSales, SUM(total_cost) as totalTotalCost FROM report_table GROUP BY monthYear ORDER BY monthYear DESC LIMIT 1;",
        [],
        (_, { rows }) => {
          const recentAggregatedReport = rows._array[0] || null;
          resolve(recentAggregatedReport);
        },
        (_, error) => {
          console.error('Error fetching recent monthly aggregated report:', error);
          reject(error);
        }
      );
    });
  });
};

export const getRecentWeeklyAggregatedReport = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT strftime('%Y-%W', date) AS weekYear, SUM(profit) as totalProfit, SUM(net_sales) as totalNetSales, SUM(total_cost) as totalTotalCost FROM report_table GROUP BY weekYear ORDER BY weekYear DESC LIMIT 1;",
        [],
        (_, { rows }) => {
          const recentAggregatedReport = rows._array[0] || null;
          resolve(recentAggregatedReport);
        },
        (_, error) => {
          console.error('Error fetching recent weekly aggregated report:', error);
          reject(error);
        }
      );
    });
  });
};

export const getMonthlyAggregatedReports = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT strftime("%Y-%m", date) as monthYear, SUM(profit) as totalProfit, SUM(net_sales) as totalNetSales, SUM(total_cost) as totalTotalCost FROM report_table GROUP BY monthYear;',
        [],
        (_, { rows }) => {
          const monthlyAggregatedReports = rows._array;
          resolve(monthlyAggregatedReports);
        },
        (_, error) => {
          console.error('Error fetching monthly aggregated reports:', error);
          reject(error);
        }
      );
    });
  });
};

export const getWeeklyAggregatedReports = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT strftime("%Y-%W", date) as weekYear, SUM(profit) as totalProfit, SUM(net_sales) as totalNetSales, SUM(total_cost) as totalTotalCost FROM report_table GROUP BY weekYear;',
        [],
        (_, { rows }) => {
          const weeklyAggregatedReports = rows._array;
          resolve(weeklyAggregatedReports);
        },
        (_, error) => {
          console.error('Error fetching weekly aggregated reports:', error);
          reject(error);
        }
      );
    });
  });
};

export const getOverallAggregatedReports = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT date, SUM(profit) as totalProfit, SUM(net_sales) as totalNetSales, SUM(total_cost) as totalTotalCost FROM report_table GROUP BY date;',
        [],
        (_, { rows }) => {
          const overallAggregatedReports = rows._array;
          resolve(overallAggregatedReports);
        },
        (_, error) => {
          console.error('Error fetching overall aggregated reports:', error);
          reject(error);
        }
      );
    });
  });
};

export const getAggregatedReports = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT date, COALESCE(SUM(profit), 0) as totalProfit, COALESCE(SUM(net_sales), 0) as totalNetSales, COALESCE(SUM(total_cost), 0) as totalTotalCost FROM report_table GROUP BY date ORDER BY date DESC;',
        [],
        (_, { rows }) => {
          const aggregatedReports = rows._array;
          resolve(aggregatedReports);
        },
        (_, error) => {
          console.error('Error fetching aggregated reports:', error);
          reject(error);
        }
      );
    });
  });
};

export const getWeeklyAggregatedReportsGraph = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        // Adjust the strftime format based on your database syntax
        'SELECT strftime("%Y-%W", date) as week, COALESCE(SUM(profit), 0) as totalProfit, COALESCE(SUM(net_sales), 0) as totalNetSales, COALESCE(SUM(total_cost), 0) as totalTotalCost FROM report_table GROUP BY week ORDER BY week DESC;',
        [],
        (_, { rows }) => {
          const aggregatedReports = rows._array;
          resolve(aggregatedReports);
        },
        (_, error) => {
          console.error('Error fetching weekly aggregated reports:', error);
          reject(error);
        }
      );
    });
  });
};

export const getMonthlyAggregatedReportsGraph = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        // Adjust the strftime format based on your database syntax
        'SELECT strftime("%Y-%m", date) as month, COALESCE(SUM(profit), 0) as totalProfit, COALESCE(SUM(net_sales), 0) as totalNetSales, COALESCE(SUM(total_cost), 0) as totalTotalCost FROM report_table GROUP BY month ORDER BY month DESC;',
        [],
        (_, { rows }) => {
          const aggregatedReports = rows._array;
          resolve(aggregatedReports);
        },
        (_, error) => {
          console.error('Error fetching monthly aggregated reports:', error);
          reject(error);
        }
      );
    });
  });
};