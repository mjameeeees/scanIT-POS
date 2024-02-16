import SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('database.sqlite');

const getAllTransactionsReceipt = async () => {
  const transaction = await db.transactionAsync();

  const rows = await transaction.executeSqlAsync(
    'SELECT * FROM transactions_table_final;'
  );

  // Convert the rows to a JSON string
  const json = JSON.stringify(rows.rows._array);

  // Close the transaction
  transaction.closeAsync();

  // Return the JSON string
  return json;
};

// Export the function
export default getAllTransactionsReceipt;