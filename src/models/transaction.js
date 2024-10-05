const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Request = require('./Request')

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER
  },
  request_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Request,
      key: 'id' 
    }
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
    type: DataTypes.STRING(100)
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },

}, {
  tableName: 'transaction',
  timestamps: false
});

module.exports = Transaction;