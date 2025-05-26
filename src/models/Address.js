const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Request = require('./Request'); // Import Request model for FK

const Address = sequelize.define('Address', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  address_line_1: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  address_line_2: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  lat: {
    type: DataTypes.NUMERIC(10, 8), // PostgreSQL prefers NUMERIC over DECIMAL
    allowNull: true
  },
  lon: {
    type: DataTypes.NUMERIC(11, 8), // PostgreSQL prefers NUMERIC over DECIMAL
    allowNull: true
  },
  offset_std: {
    type: DataTypes.STRING,
    allowNull: true
  },
  abbreviation_std: {
    type: DataTypes.STRING,
    allowNull: true
  },
  zip: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false // Ensures country is always provided
  },
  country_code: {
    type: DataTypes.STRING(2),
    allowNull: false
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true
  },
  state_code: {
    type: DataTypes.STRING(2),
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  street: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'addresses', // Pluralized for PostgreSQL
  timestamps: true, // Sequelize auto-handles createdAt & updatedAt
  underscored: true // Converts camelCase fields to snake_case in DB
});

module.exports = Address;
