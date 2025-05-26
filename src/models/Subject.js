const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Subject = sequelize.define('Subject', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  logo: DataTypes.STRING,
  slug: { type: DataTypes.STRING, unique: true, allowNull: false }
}, {
  tableName: 'subjects',
  timestamps: true,
  underscored: true
});

module.exports = Subject;
