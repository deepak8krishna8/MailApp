var con = require('./mysqlConnection.js')

//execute query to insert mail details in mail table. and return if success.
function sendMail(sender,reciever,subject,message,callback){
	var sql = "insert into mail(sender,reciever,subject,message) values('"+sender+"','"+reciever+"','"+subject+"','"+message+"');";
		con.query(sql,(err)=>{
			if (err) throw err;
			else
			callback();
		});
}

//execute query to check Inobx and return result.
function fetchMailList(email,callback){
	con.query("Select * from mail where reciever = '"+email+"'; ",(err,result)=>{
	if(err) throw err;
	else{
		if(result.length > 0){
			callback(null,result);
		}
		else{
			callback();
		}
	}
	});
}

function sentBox(email,callback){
	var sql = "Select * from mail where sender = '"+email+"'; ";
	con.query(sql,(err,result)=>{
		if(err) throw err;
		else{
			if(result.length > 0){
			callback(null,result);
			}
			else{
			callback();
			}
		}
	});
}


//execute query to delete all mails of individual logged in user and return if success.
function deleteInbox(email,callback){
	var sql = "delete from mail where reciever ='"+email+"';"
	con.query(sql,(err)=>{
		if(err) throw err;
		else
		callback();
	})
}

//change old password with new one and reeturn if success.
function updatePassword(email,password,callback){
	var sql = "update account set password = '"+password+"' where emailid ='"+email+"';"
	con.query(sql,(err)=>{
		if(err) throw err;
		else
		callback();
	})
}
module.exports = {
	sendmail : sendMail,
	chekcinbox : fetchMailList,
	deleteinbox : deleteInbox,
	updatepassword : updatePassword,
	sentbox : sentBox
}