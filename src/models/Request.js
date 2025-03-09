const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Address = require('./Address');

const Request = sequelize.define('Request', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id', // Changed from 'email' to 'user_id' (better for FK)
    },
    onDelete: 'SET NULL',
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['tutoring', 'job support', 'assignment']], // ENUM Alternative
    },
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active',
    validate: {
      isIn: [['active', 'inactive']], // ENUM Alternative
    },
  },
  level: DataTypes.STRING,
  tutors_want: DataTypes.STRING,
  gender_preference: DataTypes.STRING,
  description: DataTypes.TEXT,
  nature: DataTypes.STRING,
  meeting_options: DataTypes.STRING,
  get_tutors_from: DataTypes.STRING,
  price_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  price_currency_symbol: {
    type: DataTypes.STRING(5),
    allowNull: true,
  },
  price_currency: {
    type: DataTypes.STRING(3),
    allowNull: true,
  },
  price_option: DataTypes.STRING,
  upload_file: DataTypes.STRING,
  i_need_someone: DataTypes.TEXT,
  address_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Address,
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
}, {
  tableName: 'requests', // Pluralized for PostgreSQL
  timestamps: true, // Automatically adds createdAt & updatedAt
  underscored: true, // Converts camelCase fields to snake_case in DB
});

module.exports = Request;
