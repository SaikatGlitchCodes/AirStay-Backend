const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User'); // Import User for FK reference
const Request = require('./Request');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Ensure foreign key integrity
      key: 'id'
    }
  },
  request_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
    type: DataTypes.STRING(100),
    allowNull: true // Some transactions might not involve payments
  }
}, {
  tableName: 'transaction',
  timestamps: true // Sequelize will auto-handle createdAt & updatedAt
});

module.exports = Transaction;
