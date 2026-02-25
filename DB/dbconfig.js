import pkg from "pg";
const { Pool } = pkg;

// PostgreSQL connection pool
const dbconnection = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false,
  } : false,
});

// Wrapper to make PostgreSQL work like MySQL's execute method
// Converts ? placeholders to $1, $2, etc. for PostgreSQL
dbconnection.execute = async function(sql, params = []) {
  // Convert MySQL ? placeholders to PostgreSQL $1, $2, etc.
  let paramIndex = 1;
  const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
  
  const result = await this.query(pgSql, params);
  
  // Return in MySQL format: [rows, fields]
  return [result.rows, result.fields];
};

// Override query method to also return MySQL-like format
const originalQuery = dbconnection.query.bind(dbconnection);
dbconnection.query = async function(sql, params = []) {
  // If it's a string query with params
  if (typeof sql === 'string' && params.length > 0) {
    // Convert MySQL ? placeholders to PostgreSQL $1, $2, etc.
    let paramIndex = 1;
    const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
    
    const result = await originalQuery(pgSql, params);
    
    // Return in MySQL format: [rows, fields]
    return [result.rows, result.fields];
  }
  
  // For queries without params or already in PostgreSQL format
  const result = await originalQuery(sql, params);
  
  // If it's a simple query, return rows directly
  if (result.rows) {
    return result;
  }
  
  return result;
};

export default dbconnection;



// import mysql from "mysql2/promise";
// import dotenv from "dotenv";

// dotenv.config();

// const dbconnection = mysql.createPool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   connectionLimit: 11,
//   ssl: {
//     rejectUnauthorized: true,
//   },
// });

// export default dbconnection;
