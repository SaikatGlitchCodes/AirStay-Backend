var mysql = require("mysql");

var hostname = "27s.h.filess.io";
var database = "airstayhotels_diagramhis";
var port = "3307";
var username = "airstayhotels_diagramhis";
var password = "60fc7c7faf0b08f8d27f21df661ecf65b7224c23";

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