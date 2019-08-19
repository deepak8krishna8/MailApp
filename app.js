const express = require('express');
var path = require('path');
const bodyParser = require('body-parser');

const logincontroller = require('./models/loginController.js')
const mailcontroller = require('./models/MailController.js')

const app = express();
const port = 3000;

app.use(express.static('public'));

app.set('views',path.join(__dirname,'views'));//Location of hbs file
app.set('view engine','hbs'); // extension


app.get('/',(req,res)=>{res.render("index")});

app.get('/home',(request,response)=>{


	logincontroller.logincheck(userid,pass,(err,data)=>{
 	if(err) throw err;
 	else{
 		mailcontroller.chekcinbox(data[0].emailid,(err,result)=>{
 			if (err) throw err;
 			else
 			{	if(typeof result ==='undefined'){
 				response.render('home',{msg: nameFromDb , emptyStatus : "No mails in the box"});
 				}else{
 				
 					response.render('home',{msg: nameFromDb , inboxStatus : result});


 				}
 				
 			}
 		});
 	}

 });
})
app.get('/sentbox',(request,response)=>{
	logincontroller.logincheck(userid,pass,(err,data)=>{
 	if(err) throw err;
 	else{
 		mailcontroller.sentbox(data[0].emailid,(err,result)=>{
 			if (err) throw err;
 			else
 			{	if(typeof result ==='undefined'){
 				response.render('sentbox',{msg: nameFromDb , emptyStatus : "No sent mails in the box"});
 				}else{
 				
 					response.render('sentbox',{msg: nameFromDb , inboxStatus : result});


 				}
 				
 			}
 		});
 		}

 	});
})
app.get('/compose',(request,response)=>{response.render('compose',{msg: nameFromDb})})
app.get('/changepassword',(request,response)=>{response.render('changepassword',{msg: nameFromDb})})
app.get('/register',(request,response)=>{response.render('register')})
app.get('/deletemail',(request,response)=>{
	
	logincontroller.logincheck(userid,pass,(err,data)=>{
 	if(err) throw err;
 	else{
 		mailcontroller.deleteinbox(data[0].emailid,(err)=>{
 			if(err) throw err;
 			else{
 				response.render('home',{msg: nameFromDb, message : "Mails Deleted successfully" });

 			}
 			
 		});
 		
 	}

 });
})


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended : true
}))
var userid;
var pass;
var nameFromDb;
app.post('/loginCheck',(request,response)=>{
	 userid = request.body.name;
	 pass = request.body.pwd;
	logincontroller.logincheck(userid,pass,(err,data)=>{
 	if(err) throw err;
 	else
 		{
 			if(typeof data !== 'undefined' && data[0].name== userid && data[0].password == pass){
 			nameFromDb = data[0].name;
 			response.render('home',{msg: data[0].name});
 			
 			}
 			else if(data == null){
 			response.render('index',{msg: 'login Failed'});
 			console.log(request.body.userid)
 			}
 		}
 	
	 });

});

app.post('/register',(request,response)=>{
var name = request.body.name;
var email = request.body.email;
var pwd = request.body.pwd;

logincontroller.createuser(name,email,pwd,(err)=>{
	if (err) throw err;
	else
	{
		response.render('index',{msg:'Account created successfully! Now Login'});
		console.log('Account created');
	}
})
})

app.post('/updatePassword',(request,response)=>{
	logincontroller.logincheck(userid,pass,(err,data)=>{
 	if(err) throw err;
 	else{
 			var oldpass = request.body.oldpwd;
 			var newpass = request.body.newpwd;
 		if(oldpass === data[0].password){
 			mailcontroller.updatepassword(data[0].emailid,newpass,(err)=>{
 				if(err) throw err;
 				else
 					response.render('index',{msg:'Password changed successfully ! Login Again'})
 			})
 		}else
 		{
 			response.render('changepassword',{log:'Password doesnt match! Try again'})
 		}
 	}
	
 	});
})

app.post('/sendMail',(request,response)=>{
	logincontroller.logincheck(userid,pass,(err,data)=>{
 	if(err) throw err;
 	else{
 		var reciever = request.body.reciever;
 		var subject = request.body.subject;
 		var message = request.body.message;
		mailcontroller.sendmail(data[0].emailid,reciever,subject,message,(err)=>{
			if(err) throw err;
			else{
				response.render('compose',
					{sent:"Mail Sent Successfully",
					msg : nameFromDb
					})
			}
		});	
	
 	}

 });
})

app.listen(3000 ,()=>{console.log(`Example app listening on port ${port}!`)})