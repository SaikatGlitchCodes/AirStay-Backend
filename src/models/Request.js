const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Request = sequelize.define('Request', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_email: {
    type: DataTypes.STRING,
    allowNull: false,
    references: { model: 'users', key: 'email' },
    onDelete: 'SET NULL'
  },
  phone_number: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.ENUM('tutoring', 'job support', 'assignment'), allowNull: false },
  status: { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'active' },
  level: DataTypes.STRING,
  tutors_want: DataTypes.STRING,
  gender_preference: DataTypes.STRING,
  description: DataTypes.TEXT,
  nature: DataTypes.STRING,
  online_meeting: { type: DataTypes.BOOLEAN, defaultValue: false },
  offline_meeting: { type: DataTypes.BOOLEAN, defaultValue: false },
  travel_meeting: { type: DataTypes.BOOLEAN, defaultValue: false },
  get_tutors_from: DataTypes.STRING,
  price_amount: DataTypes.DECIMAL(10, 2),
  price_currency_symbol: DataTypes.STRING(5),
  price_currency: DataTypes.STRING(3),
  price_option: DataTypes.STRING,
  upload_file: DataTypes.STRING,
  i_need_someone: DataTypes.TEXT,
  language: DataTypes.JSONB,
  address_id: {
    type: DataTypes.INTEGER,
    references: { model: 'addresses', key: 'id' },
    onDelete: 'SET NULL'
  }
}, {
  tableName: 'requests',
  timestamps: true,
  underscored: true
});

module.exports = Request;
