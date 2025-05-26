const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserSubjectRel = sequelize.define('UserSubjectRel', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: { model: 'users', key: 'id' }
  },
  subject_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: { model: 'subjects', key: 'id' }
  }
}, {
  tableName: 'user_subject_rel',
  timestamps: false,
  underscored: true
});

module.exports = UserSubjectRel;
