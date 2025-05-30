const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Address = sequelize.define('Address', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  address_line_1: { type: DataTypes.TEXT, allowNull: true },
  address_line_2: { type: DataTypes.TEXT, allowNull: true },
  lat: { type: DataTypes.NUMERIC(10, 8), allowNull: true },
  lon: { type: DataTypes.NUMERIC(11, 8), allowNull: true },
  offset_std: { type: DataTypes.STRING, allowNull: true },
  abbreviation_std: { type: DataTypes.STRING, allowNull: true },
  zip: { type: DataTypes.STRING, allowNull: true },
  country: { type: DataTypes.STRING, allowNull: false },
  country_code: { type: DataTypes.STRING(2), allowNull: false },
  state: { type: DataTypes.STRING, allowNull: true },
  state_code: { type: DataTypes.STRING(2), allowNull: true },
  city: { type: DataTypes.STRING, allowNull: true },
  street: { type: DataTypes.STRING, allowNull: true }
}, {
  tableName: 'addresses',
  timestamps: true,
  underscored: true
});

module.exports = Address;
