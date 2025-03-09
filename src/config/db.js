const { Sequelize } = require("sequelize");
require("dotenv").config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env file");
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true, // Required for Neon
      rejectUnauthorized: false,
    },
  },
  logging: process.env.NODE_ENV === "development", // Enable logging in dev mode
  pool: {
    max: 10,
    min: 2, // Avoid cold starts
    acquire: 30000,
    idle: 5000, // Lower idle time for faster recycling
  },
});

// Function to test database connection
const testDBConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.message);
    process.exit(1); // Exit process if connection fails
  }
};

testDBConnection();

module.exports = sequelize;
