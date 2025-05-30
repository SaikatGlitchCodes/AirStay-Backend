const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RequestSubjectRel = sequelize.define('RequestSubjectRel', {
  request_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: { model: 'requests', key: 'id' }
  },
  subject_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: { model: 'subjects', key: 'id' }
  }
}, {
  tableName: 'request_subject_rel',
  timestamps: false,
  underscored: true
});

module.exports = RequestSubjectRel;
