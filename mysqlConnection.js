var mysql = require('mysql')

var con = mysql.createConnection({
	host : 'localhost',
	port : '3306',
	user : 'root',
	password : 'admin',
	database : 'mailapp'
});



module.exports = con;