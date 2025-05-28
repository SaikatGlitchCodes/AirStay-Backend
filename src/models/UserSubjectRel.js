const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserSubjectRel = sequelize.define('UserSubjectRel', {
  user_email: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    references: { model: 'users', key: 'email' }
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
