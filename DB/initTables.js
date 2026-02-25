import dbconnection from "./dbconfig.js";

export async function initializeTables() {
  try {
    // Users table
    const usersTable = await dbconnection.query(`
      CREATE TABLE IF NOT EXISTS users (
        userid SERIAL PRIMARY KEY,
        username VARCHAR(20) NOT NULL,
        firstname VARCHAR(20) NOT NULL,
        lastname VARCHAR(20) NOT NULL,
        email VARCHAR(40) NOT NULL UNIQUE,
        password VARCHAR(250) NOT NULL,
        reset_token VARCHAR(255),
        profile_picture VARCHAR(250),
        reset_token_expires TIMESTAMP
      );
    `);

    // Questions table
    const questionsTable = await dbconnection.query(`
      CREATE TABLE IF NOT EXISTS questions (
        questionid SERIAL PRIMARY KEY,
        userid INT NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
        title VARCHAR(50) NOT NULL,
        description VARCHAR(200) NOT NULL,
        tag VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Answers table
    const answersTable = await dbconnection.query(`
      CREATE TABLE IF NOT EXISTS answers (
        answerid SERIAL PRIMARY KEY,
        userid INT NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
        questionid INT NOT NULL REFERENCES questions(questionid) ON DELETE CASCADE,
        answer TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Chat history table
    const chatTable = await dbconnection.query(`
      CREATE TABLE IF NOT EXISTS chat_history (
        chatid SERIAL PRIMARY KEY,
        userid INT NOT NULL REFERENCES users(userid) ON DELETE CASCADE,
        role VARCHAR(10) CHECK (role IN ('system','user','assistant')),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ All tables created or already exist");
  } catch (error) {
    console.error("❌ Error creating tables:", error.message);
    throw error;
  }
}
