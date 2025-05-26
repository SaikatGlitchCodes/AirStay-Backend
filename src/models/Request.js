const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Request = sequelize.define('Request', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'SET NULL'
  },
  phone_number: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false, validate: { isIn: [['tutoring', 'job support', 'assignment']] } },
  status: { type: DataTypes.STRING, defaultValue: 'active', validate: { isIn: [['active', 'inactive']] } },
  level: DataTypes.STRING,
  tutors_want: DataTypes.STRING,
  gender_preference: DataTypes.STRING,
  description: DataTypes.TEXT,
  nature: DataTypes.STRING,
  meeting_options: DataTypes.STRING,
  get_tutors_from: DataTypes.STRING,
  price_amount: DataTypes.DECIMAL(10, 2),
  price_currency_symbol: DataTypes.STRING(5),
  price_currency: DataTypes.STRING(3),
  price_option: DataTypes.STRING,
  upload_file: DataTypes.STRING,
  i_need_someone: DataTypes.TEXT,
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
