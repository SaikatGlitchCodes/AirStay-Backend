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
    }
  },
  subject_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Subject,
      key: 'id'
    }
  }
}, {
  tableName: 'request_subject_rel',
  timestamps: false
});

module.exports = RequestSubjectRel;
