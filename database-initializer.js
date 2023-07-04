let userNames = ["winnifred", "lorene", "cyril", "vella", "erich", "pedro", "madaline", "leoma", "merrill",  "jacquie"];
let users = [];

// I added order attribute for every user
userNames.forEach(name =>{
	let u = {};
	u.username = name;
	u.password = name;
	// Change back to false
	u.privacy = false;
	u.order = [];
	users.push(u);
});

let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let db;

MongoClient.connect("mongodb://localhost:27017/", function(err, client) {
  if(err) throw err;	

  db = client.db('a4');
  
  db.listCollections().toArray(function(err, result){
	 if(result.length == 0){
		 db.collection("users").insertMany(users, function(err, result){
			if(err){
				throw err;
			}
			
			console.log(result.insertedCount + " users successfully added (should be 10).");
			
			client.close();
		});
		return;
	 }
	 
	 let numDropped = 0;
	 let toDrop = result.length;
	 result.forEach(collection => {
		db.collection(collection.name).drop(function(err, delOK){
			if(err){
				throw err;
			}
			
			console.log("Dropped collection: " + collection.name);
			numDropped++;
			
			if(numDropped == toDrop){
				db.collection("users").insertMany(users, function(err, result){
					if(err){
						throw err;
					}
					
					console.log(result.insertedCount + " users successfully added (should be 10).");
					client.close();
				});
			}
		});		
	 });
  });
});