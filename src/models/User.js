const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('student', 'tutor', 'admin', 'user'), allowNull: false },
  phone_number: DataTypes.STRING,
  gender: DataTypes.STRING,
  address_id: {
    type: DataTypes.INTEGER,
    references: { model: 'addresses', key: 'id' }
  },
  bio: DataTypes.TEXT,
  years_of_experience: DataTypes.FLOAT,
  rating: DataTypes.DECIMAL(3, 2),
  profile_img: DataTypes.STRING,
  hobbies: DataTypes.TEXT,
  coin_balance: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.ENUM('active', 'inactive', 'ban'), defaultValue: 'active' }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true
});

module.exports = User;
