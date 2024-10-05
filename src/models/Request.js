const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Address = require('./Address');

const Request = sequelize.define('Request', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'email'
    }
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('tutoring', 'job support', 'assignment'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
  level: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tutors_want: {
    type: DataTypes.STRING,
    allowNull: true
  },
  gender_preference: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  nature: {
    type: DataTypes.STRING,
    allowNull: true
  },
  meeting_options: {
    type: DataTypes.STRING,
    allowNull: true
  },
  get_tutors_from: {
    type: DataTypes.STRING,
    allowNull: true
  },
  price_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  price_currency_symbol: {
    type: DataTypes.STRING(5),
    allowNull: true
  },
  price_currency: {
    type: DataTypes.STRING(3),
    allowNull: true
  },
  price_option: {
    type: DataTypes.STRING,
    allowNull: true
  },
  upload_file: {
    type: DataTypes.STRING,
    allowNull: true
  },
  i_need_someone: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  address_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Address,
      key: 'id'
    }
  }
}, {
  tableName: 'request',
  timestamps: true // Sequelize will auto-handle createdAt and updatedAt
});

module.exports = Request;
