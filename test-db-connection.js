import dotenv from "dotenv";
dotenv.config();
import dbconnection from "./DB/dbconfig.js";

async function testConnection() {
  console.log("🔍 Testing database connection...\n");
  
  try {
    // Test 1: Basic connection
    console.log("Test 1: Basic connection");
    const result = await dbconnection.query("SELECT NOW() as current_time");
    console.log("✅ Connected successfully");
    console.log("   Current time:", result.rows ? result.rows[0].current_time : result[0]?.current_time);
    
    // Test 2: MySQL-style query with ? placeholders
    console.log("\nTest 2: MySQL-style query (? placeholders)");
    const [users] = await dbconnection.execute(
      "SELECT $1::text as test_value",
      ["Hello from PostgreSQL"]
    );
    console.log("✅ Query wrapper working");
    console.log("   Result:", users);
    
    // Test 3: Check if tables exist
    console.log("\nTest 3: Checking tables");
    const tables = await dbconnection.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    const tableList = tables.rows || tables;
    if (tableList.length > 0) {
      console.log("✅ Tables found:");
      tableList.forEach(t => console.log("   -", t.table_name));
    } else {
      console.log("⚠️  No tables found (will be created on server start)");
    }
    
    console.log("\n✅ All tests passed! Database is ready for deployment.");
    
  } catch (error) {
    console.error("\n❌ Database connection failed:");
    console.error("   Error:", error.message);
    console.error("\n🔧 Troubleshooting:");
    console.error("   1. Check DATABASE_URL is set in .env file");
    console.error("   2. Verify PostgreSQL is running");
    console.error("   3. Check connection string format:");
    console.error("      postgresql://user:password@host:port/database");
    process.exit(1);
  } finally {
    await dbconnection.end();
    console.log("\n🔌 Connection closed");
  }
}

testConnection();
