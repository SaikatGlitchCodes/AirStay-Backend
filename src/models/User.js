const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Address = require('./Address');
const Subject = require('./Subject');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('student', 'tutor', 'admin'),
    allowNull: false
  },
  phone_number: DataTypes.STRING,
  gender: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  address_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Address,
      key: 'id'
    }
  },
  bio: DataTypes.TEXT,
  years_of_experience: DataTypes.DATE,
  rating: DataTypes.DECIMAL(3, 2),
  profile_img: DataTypes.STRING,
  hobbies: DataTypes.TEXT,
  subject_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Subject,
      key: 'id'
    }
  },
  coin_balance: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'ban'),
    defaultValue: 'active'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'user'
});

module.exports = User;
