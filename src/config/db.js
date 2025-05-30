const { Sequelize } = require("sequelize");
require("dotenv").config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env file");
}

const validateDatabaseURL = (url) => {
  try {
    const parsedUrl = new URL(url);
    return {
      isValid: true,
      hostname: parsedUrl.hostname,
    };
  } catch (error) {
    return {
      isValid: false,
      error: "Invalid DATABASE_URL format",
    };
  }
};

const urlValidation = validateDatabaseURL(process.env.DATABASE_URL);
if (!urlValidation.isValid) {
  console.error(`❌ ${urlValidation.error}`);
  process.exit(1);
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: process.env.NODE_ENV === "development",
  pool: {
    max: 10,
    min: 2,
    acquire: 30000,
    idle: 5000,
  },
});

const testDBConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.message);

    if (error.message.includes("ENOTFOUND")) {
      console.error(`
      📌 DNS Resolution Error: Could not resolve hostname "${urlValidation.hostname}"

      Possible solutions:
      1. Check your DATABASE_URL for typos
      2. Verify that the database hostname is correct
      3. Ensure your network connection is working
      4. Check if your VPN settings are blocking the connection
      5. Verify the Supabase database is online at https://app.supabase.com
      `);
    }

    process.exit(1); // Exit process if connection fails
  }
};

testDBConnection();

module.exports = sequelize;
