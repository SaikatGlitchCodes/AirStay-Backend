const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Subject = sequelize.define('Subject', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: DataTypes.TEXT,
  logo: DataTypes.STRING,
  slug: { type: DataTypes.STRING }
}, {
  tableName: 'subjects',
  timestamps: true,
  underscored: true
});

module.exports = Subject;
