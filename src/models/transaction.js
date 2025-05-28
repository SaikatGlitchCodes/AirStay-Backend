const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Transaction = sequelize.define('Transaction', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_email: {
    type: DataTypes.STRING,
    allowNull: false,
    references: { model: 'users', key: 'email' }
  },
  request_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'requests', key: 'id' }
  },
  transaction_type: {
    type: DataTypes.ENUM('spend', 'earn'),
    allowNull: false
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  payment_method: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'transactions',
  timestamps: true,
  underscored: true
});

module.exports = Transaction;
