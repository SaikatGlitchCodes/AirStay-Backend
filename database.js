var mysql = require("mysql");

var hostname = "7ha.h.filess.io";
var database = "Airstay_puttingmix";
var port = "3307";
var username = "Airstay_puttingmix";
var password = "5b1f895356f58f9d9ad7f645dee69ce1e4ae1a49";

var con = mysql.createConnection({
  host: hostname,
  user: username,
  password,
  database,
  port,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = {con}