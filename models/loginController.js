var con = require('./mysqlConnection.js')

//execute query to get login details and return details as result.
function loginCheck(name,password, callback){ 
	// con.connect((err)=>{ if(err) throw err;});

	con.query("Select * from account where name ='"+name+"' and password = '"+password+"'; ",(err,result)=>{
	if(err) throw err;
	else{
		if(result.length > 0){
			callback(null,result);
		}
		else{
			//console.log("Invalid id or password")
			callback(null);
		}
	}
	});
	
}

//execute query to create new account and return if inserted successfully.
function createUser(name,emailid,password,callback){
	var sql = "insert into account(name,emailid,password) values('"+name+"','"+emailid+"','"+password+"');";
		con.query(sql,(err)=>{
			if (err) throw err;
			else
			callback();
		});
	
}



module.exports = {
	logincheck : loginCheck,
	createuser : createUser
}