const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Request = require('./Request');
const Subject = require('./Subject');

const RequestSubjectRel = sequelize.define('RequestSubjectRel', {
  request_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Request,
      key: 'id'
    },
    primaryKey: true
  },
  subject_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Subject,
      key: 'id'
    },
    primaryKey: true
  }
}, {
  tableName: 'request_subject_rel',
  timestamps: true // Disable createdAt and updatedAt for join table
});

module.exports = RequestSubjectRel;
