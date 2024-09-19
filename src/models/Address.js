const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Address = sequelize.define('Address', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  request_id: DataTypes.INTEGER,
  address_line_1: DataTypes.TEXT,
  address_line_2: DataTypes.TEXT,
  lat: DataTypes.DECIMAL(10, 8),
  lon: DataTypes.DECIMAL(11, 8),
  offset_std: DataTypes.STRING,
  abbreviation_std: DataTypes.STRING,
  zip: DataTypes.STRING,
  country: DataTypes.STRING,
  country_code: DataTypes.STRING(2),
  state: DataTypes.STRING,
  state_code: DataTypes.STRING(2),
  city: DataTypes.STRING,
  street: DataTypes.STRING,
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'address'
});

module.exports = Address;
