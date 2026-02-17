import pkg from "pg";
const { Pool } = pkg;

const dbconnection = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

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
