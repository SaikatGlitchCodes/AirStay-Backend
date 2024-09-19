const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Subject = require('./Subject');

const UserSubjectRel = sequelize.define('UserSubjectRel', {
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
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
  tableName: 'user_subject_rel',
  timestamps: false
});

module.exports = UserSubjectRel;
