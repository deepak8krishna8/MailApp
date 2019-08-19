const readline = require('readline-sync')
const logincontroller = require('./models/loginController.js')
const mailcontroller = require('./models/MailController.js')


//Starting of App Entry function will be called
	
entryApp();
function entryApp(){
	console.log("-------------------------------------------------------------------------")
	console.log("-------------------------------MAIL APP----------------------------------")
	console.log("Select Login if you are existing user or create new account if you are new.\n");
	console.log("\t\t\t-------------------------");
	console.log("\t\t\t1. LOGIN ");
	console.log("\t\t\t-------------------------");
	console.log("\t\t\t2. CREATE USER ACCOUNT");
	console.log("\t\t\t-------------------------\n");
	var entry = readline.question("Enter you choice Enter 1 For Login and 2 For Creating new account - ");
	switch(entry){
		case '1':
			login();
			break;
		case '2': 
			createAccount();
			break;
		default:
			console.log("Invalid Input");
	}
}

//Take login details from user and check verify login from login controller.
var name;
var password;
function login(){
	console.log("\n-------------------------LOGIN-------------------------\n")
  	name = readline.question("Enter your Username -: ");
  	password = readline.question("Enter your Passowrd -: ");
	logincontroller.logincheck(name,password,(err,data)=>{
 	if(err) throw err;
 	else
 		if(typeof data !== 'undefined' && data[0].name== name && data[0].password == password){
 		
 			console.log("\n---------------------------Welcome "+data[0].name+"------------------------");
 			homeUI();
 		}
 		else if(data == null){
 			console.log("Invalid Password");
 			entryApp();
 		}
	 });

}

//Take user details and create new account from loginController.js
function createAccount(){
	console.log("\n-------------------------CREATE ACCOUNT------------------------\n")

	 var name = readline.question("Enter your Username -: ");
	 var emailid = readline.question("Enter your EmailID -: ");
	 var password = readline.question("Ente your Passowrd-:");

	  	logincontroller.createuser(name,emailid,password,(err)=>{
	  		if (err) throw err;
	  		else{
	  			console.log("\n-----------Account Created successfully--------------\n");
	  			entryApp();
	  		}
	  	});
}

//After Login UI and Options to select by user
function homeUI(){

	
	console.log("\n\t\t\t-------------------------");
	console.log("\t\t\t1. Send Mail ");
	console.log("\t\t\t-------------------------");
	console.log("\t\t\t2. Check Inbox");
	console.log("\t\t\t-------------------------");
	console.log("\t\t\t3. Delete All Mails");
	console.log("\t\t\t-------------------------");
	console.log("\t\t\t4. Change Password");
	console.log("\t\t\t-------------------------");
	console.log("\t\t\t5. Logout");
	console.log("\t\t\t-------------------------\n");
	console.log("------------------------------------------------------------------");
	var choice = readline.question("Enter your choice 1-4 => ");
	switch(choice){
		case '1':
			sendMail();
			break;
		case '2': 
			checkInbox();
			break;
		case '3': 

			checkInbox();
			console.log("\n----------------Delete Inbox----------------------")
			var inp = readline.question("Do you really want to delete Inbox ?(y/n) -: ");
				switch(inp){
					case 'y':
					deleteInbox();
					break;
					case 'Y':
					deleteInbox();
					break;
					case 'n':
					homeUI();
					break;
					case 'N':
					homeUI();
					break;
					default:
					console.log("Wrong Input");
					homeUI();

					}
			break;
		case '4': 
			changePassword();
			break;
		case '5':
			entryApp();
			break;
		default:
			console.log("Invalid Input");
			homeUI();
	}
}

//When user select send mail this function will be called. Take input from user and send mail from mailController.js
function sendMail(){ 
	logincontroller.logincheck(name,password,(err,data)=>{
 	if(err) throw err;
 	else{
 		console.log("\n------------------------------Compose Mail---------------------------------\n\n")
 		console.log("------------------------------------------------------------------------------")
 		console.log("Sender Name=> "+data[0].name+" ---------Sender Email ID => "+data[0].emailid);
 		console.log("------------------------------------------------------------------------------")
 		var reciever = readline.question("Reciever Email Id => ");
 		console.log("------------------------------------------------------------------------------")
 		var subject = readline.question("Subject => ");
 		console.log("------------------------------------------------------------------------------")
 		var message = readline.question("Message = >")
 		console.log("------------------------------------------------------------------------------\n")
		mailcontroller.sendmail(data[0].emailid,reciever,subject,message,(err)=>{
			if(err) throw err;
			else{
				console.log("\n---------Mail Sent Successfully---------");
				console.log("\n---------------------------Welcome "+data[0].name+"------------------------");
				homeUI();
			}
		});	
	
 	}

 });

}


//Display all the emails in the inbox.
function checkInbox(){
	logincontroller.logincheck(name,password,(err,data)=>{
 	if(err) throw err;
 	else{
 		mailcontroller.chekcinbox(data[0].emailid,(err,result)=>{
 			if (err) throw err;
 			else
 			{	if(typeof result ==='undefined'){
 				console.log("No Mails in Inbox");
 				homeUI();
 				}else{
 					console.log("\t-------------------Inbox Start------------------\n");
 					for(mail of result){
 						console.log("============================================================")
 						console.log("Mid =: "+mail.mid);
 						console.log("\n\t-------------------------------------------------------------")
 						console.log("\tFrom -: "+mail.sender+"\tTO =: "+mail.reciever);
 						console.log("\t---------------------------------------------------------------")
 						console.log("\tSubject -: "+mail.subject);
 						console.log("\t---------------------------------------------------------------")
 						console.log("\tbody -: "+mail.message);
 						console.log("\t---------------------------------------------------------------")
 						console.log("===========================================================\n")
 					}
 					console.log("\t-------------------Inbox End------------------");
 					
 					console.log("\n---------------------------Welcome "+data[0].name+"------------------------");
 				homeUI();
 				}
 				
 			}
 		});
 	}

 });
}	

//Delete the inbox if mail is present.
function deleteInbox(){
	
	logincontroller.logincheck(name,password,(err,data)=>{
 	if(err) throw err;
 	else{
 		mailcontroller.deleteinbox(data[0].emailid,(err)=>{
 			if(err) throw err;
 			else{
 				console.log("\n-------Inbox deleted successfully;----------\n")
 				console.log("\n---------------------------Welcome "+data[0].name+"------------------------");
 				homeUI();
 			}
 			
 		});
 		
 	}

 });
}

//To change password old password is required.
function changePassword(){
	logincontroller.logincheck(name,password,(err,data)=>{
 	if(err) throw err;
 	else{
 		console.log("\n------------------------Change Password--------------------------------\n\n")
 		console.log("------------------------------------------------------------------------------")
	var oldpass = readline.question("Enter your old password => ");
	console.log("------------------------------------------------------------------------------")
	var newpass = readline.question("Enter your new password => ");
	console.log("------------------------------------------------------------------------------\n")
 		if(oldpass === data[0].password){
 			mailcontroller.updatepassword(data[0].emailid,newpass,(err)=>{
 				if(err) throw err;
 				else
 					console.log("\n---------Password Changed successfilly!----------");
 					password = newpass;
 					console.log("\n---------------------------Welcome "+data[0].name+"------------------------");
 					homeUI();
 			})
 		}else
 		{
 			console.log("\n-----------Old Password does not match!------------------");
 			console.log("\n---------------------------Welcome "+data[0].name+"------------------------");
 			homeUI();
 		}
 	}
	
 	});
}