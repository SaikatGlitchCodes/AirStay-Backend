const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Subject = require('./Subject');

const UserSubjectRel = sequelize.define('UserSubjectRel', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    primaryKey: true // Composite primary key
  },
  subject_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Subject,
      key: 'id'
    },
    primaryKey: true // Composite primary key
  }
}, {
  tableName: 'user_subject_rel',
  timestamps: true // Enables createdAt & updatedAt
});

module.exports = UserSubjectRel;
