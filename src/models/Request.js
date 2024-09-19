const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Subject = require('./Subject');
const Address = require('./Address');

const Request = sequelize.define('Request', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  student_id: {
    type: DataTypes.STRING,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  type: {
    type: DataTypes.ENUM('tutoring', 'job support', 'assignment'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
  level: DataTypes.STRING,
  tutors_want: DataTypes.INTEGER,
  gender_preference: DataTypes.STRING,
  description: DataTypes.TEXT,
  nature: DataTypes.STRING,
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  subject_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Subject,
      key: 'id'
    }
  },
  address_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Address,
      key: 'id'
    }
  }
}, {
  tableName: 'request'
});

module.exports = Request;


/*
address
description
subject
level
type
meeting_options
status
tutors_want
gender_preference
get_tutors_from
price_amount
price_currency_symbol
price_currency
price_option
upload_file
i_need_someone
*/