const pug = require('pug')
const path = require('path');
const express = require('express')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const mongo = require("mongodb");


const app = express();
const USERS = "users";
const ORDERS = "orders"
const MONGO_URL = 'mongodb://localhost:27017/';
const MongoClient = mongo.MongoClient;

let db;

let sessionStore = new MongoDBStore({
    uri: 'mongodb://localhost:27017/connect_mongodb_session_test',
    collection: 'sessionData'
})

app.use(session({
    name: 'some name',
    secret: 'some secret key',
    store: sessionStore,
    cookie:{
        maxAge: 1000*60*60*24*7
    },
    resave: true,
    saveUninitialized: false,
}))

app.use(express.static('public'));
app.set('view engine', 'pug');
app.use(express.json());

// To parse form data, access req.body
app.use(express.urlencoded({extended: true}));

// GET / Home Page
app.get("/", homePage);
// GET /login
app.get("/login", loginPage);
// GET /orderform
app.get("/orderform", orderformPage);
// GET /register
app.get("/register", registerPage);
// GET /users
app.get("/users", getUsers);
// GET /user
app.get("/users/:id", getUser);
// GET /logout
// Logging out a user
app.get("/logout", logoutUser);
// GET /order
app.get("/order/:id", getOrder);
// GET /profile
app.get("/profile", profilePage);


// POST /register
// Adding a new user
// I don't think I did it right, using a sync approach, with the asynchronous
app.post("/register", registerUser);
// POST /login
// Logging in a registered user
app.post("/login", loginUser);
// POST /users
// Updating a user's privacy setting
app.post("/users", updatePrivacy);
// POST /orders
// Adding to a user's order history
app.post("/orders", updateOrderHistory);


function homePage(req, res, next){
    if (req.session.loggedin){
        res.render("pages/homePage", {
            loggedin: true,
            username: req.session.username
        }); 
    }
    else {
        res.render("pages/homePage", {loggedin: false});
    }
}

function registerPage(req, res, next){
    res.render("pages/register", {});
}

function loginPage(req, res, next){
    res.render("pages/login",)
} 

function registerUser(req, res, next) {
    // Handling if a user is already logged in
    if(req.session.loggedin){
		res.status(200).send("Already logged in.");
		return;
	}

    let username = req.body.registerUsername;
    console.log(username);

    // Handling duplicate usernames
    let isDuplicate = duplicateUsername(username);
    if(isDuplicate){
        res.status(401).send(`A user with username: ${username} already exists`);
    }

    // Initializing a user
    let u = {};
    u.username = req.body.registerUsername;
	u.password = req.body.registerPassword;
	u.privacy = false;
    u.order = {};

    // Adding the user to the database
    addUser(u);

    req.session.loggedin = true;
    req.session.username = u.username;

    if (req.session.loggedin){
        res.render("pages/homePage", {
            loggedin: true,
            username: req.session.username
        }); 
    }
}


// Update value in database
function updatePrivacy(req, res, next){
    let requestedPrivacy = req.body.privateMode;
    console.log(requestedPrivacy);
    if(requestedPrivacy == "on" && !req.session.privacy){
        let id = { _id: req.session.userID };
        let newPrivacy = { $set: { privacy: true }}
        db.collection(USERS).updateOne(id, newPrivacy, (err, result) => {
            if(err) throw err;
            if(result){
                console.log(`Privacy enabled for user: ${req.session.username}`);
                res.render("pages/homePage", {
                    loggedin: true,
                    username: req.session.username
                }); 
            }
        });
    }
    else if(requestedPrivacy == "off" && req.session.privacy){
        let id = { _id: req.session.userID };
        let newPrivacy = { $set: { privacy: false }}
        db.collection(USERS).updateOne(id, newPrivacy, (err, result) => {
            if(err) throw err;
            if(result){
                console.log(`Privacy disabled for user: ${req.session.username}`);
                res.render("pages/homePage", {
                    loggedin: true,
                    username: req.session.username
                }); 
            }
        });
    }
    else{
        res.send(406).send(`Privacy already set to ${requestedPrivacy}`)
    }
}

function duplicateUsername(username){
    db.collection(USERS)
    .find()
    .toArray((err, results) => {
        if(err) throw err;
        let userList = results;
        let usernamesArr = userList.map((user) => { return user.username })
        if(usernamesArr.hasOwnProperty(username)){
            return true;
        }
        else{
            return false;
        }
    })
}

function addUser(user){
    db.collection(USERS).insertOne(user, (err, result) => {
        if (err) throw err;
        console.log("1 document inserted");
    });
}

function getUsers(req, res, next){

    //Query URL parameters
    let nameQuery = req.query.name;
    if (nameQuery == undefined){
        db.collection(USERS)
        .find({"privacy" : false})
        .toArray((err, results) => {
        if(err) throw err;
        let userList = results;
        console.log(`getUsers: ${JSON.stringify(userList)}`);
        // Check if req.session.logged === true
        if (req.session.loggedin){
            res.render("pages/users", {
                loggedin: true,
                username: req.session.username,
                list: userList,
            });
        }
        else {
            res.render("pages/users", {
                loggedin: false,
                list: userList,
            });
        }
        });
    }

    else {
        db.collection(USERS)
        .find({ "username" : {$regex: `.*${nameQuery}.`}}, {"privacy" : false})
        .toArray((err, results) => {
            if (err) throw err;
            let userList = results;
        console.log(`getUsers: ${JSON.stringify(userList)}`);
        // Check if req.session.logged === true
        if (req.session.loggedin){
            res.render("pages/users", {
                loggedin: true,
                username: req.session.username,
                list: userList,
            });
        }
        else {
            res.render("pages/users", {
                loggedin: false,
                list: userList,
            });
        }
    });
    }
    
}

function getUser(req, res, next){
    const targetID = req.params.id;
    let oid;

    try {
        oid = new mongo.ObjectId(targetID);
    }
    catch {
        res.status(403).send("Unknown user ID");
        return;
    }

    db.collection(USERS).findOne({_id: oid}, (err, data) => {
        if (err) {
            console.log(`User with ID: ${targetID} not found`);
        }
        let user = data;
        let requestedUsername = user.username;
        let isPrivate = user.privacy;

        if (req.session.username === requestedUsername){
            // Can access the user's profile and redirects to user profile page
            res.render("pages/ownProfile", {
                username: req.session.username,
                list: user.order
            });
        }

        else if (req.session.username != requestedUsername && !isPrivate){
            // Can access another user's profile
            if (req.session.loggedin){
                res.render("pages/otherProfile", {
                    loggedin: true,
                    username: req.session.username,
                    otherUsername: requestedUsername,
                    list: user.order
                });
            }
            else {
                res.render("pages/otherProfile", {
                    loggedin: false,
                    otherUsername: requestedUsername,
                    list: user.order
                });
            }
        }

        else if (req.session.username != requestedUsername && isPrivate){
            // Cannot access another user's page
            res.status(403).send(`The user ${requestedUsername} is set to private`);
        }

    });
}

function loginUser(req, res, next){
    if(req.session.loggedin){
		res.status(200).send("Already logged in.");
		return;
	}

    let usernameInput = req.body.loginUsername;
    console.log(usernameInput)
    let user;
    db.collection(USERS).findOne({username: usernameInput}, (err, data) => {
        if(err) throw err; 
        if(data){
            user = data;
            req.session.loggedin = true;
            req.session.userID = user._id;
            req.session.username = user.username;
            req.session.privacy = user.privacy;
            req.session.order = [];
            res.render("pages/homePage", {
                loggedin: true,
                username: req.session.username,
            })
        }
        else {
            console.log(`User with username ${usernameInput} was not found`);
        }
    })
}

function logoutUser(req, res, next){
    if (req.session.loggedin){
        req.session.loggedin = false;
        req.session.username = undefined;
        req.session.privacy = undefined;
        req.session.order = [];
        res.render("pages/homePage", {loggedin: false})
    } 
    else {
        res.status(401).send("You cannot log out because you aren't logged in.");
    }
}

function orderformPage(req, res, next){
    if (req.session.loggedin){
        res.sendFile(path.join(__dirname, '/public/orderform.html'));
    }
    else{
        res.status(403).send("You cannot order anything because you aren't logged in.");
    }
}

function updateOrderHistory(req, res, next){
    if(req.session.loggedin){
        let userOrder = {
            "restaurantID":   req.body.restaurantID,
            "restaurantName": req.body.restaurantName,
            "subtotal":       req.body.subtotal,
            "total":          req.body.total,
            "fee":            req.body.fee,
            "tax":            req.body.tax,
            "order":          req.body.order
        }

        let customerOrder = { username: req.session.username, orderInfo: userOrder };
        db.collection(ORDERS).insertOne(customerOrder, (err, result) => {
            if (err) throw err;
            if(result){
                console.log(`New order has been added from user: ${req.session.username}`);
                res.render("pages/homePage", {
                    loggedin: true,
                    username: req.session.username
                })
            }
        }) 
    }
    else {
        res.status(403).send("You are not logged in");
    }
}

function profilePage(req, res, next){
    db.collection(ORDERS)
    .find({ "username": req.session.username }, { projection: {_id: 1} })
    .toArray((err, results) => {
        if(err) throw err;
        let orderList = results;
        console.log(orderList)
        if (req.session.loggedin){
            res.render("pages/ownProfile", {
                username: req.session.username,
                list: orderList
            });
        }
    })   
}

function getOrder(req, res, next){
    const targetID = req.params.id;
    let oid;

    try {
        oid = new mongo.ObjectId(targetID);
    }
    catch {
        res.status(403).send("Unknown order ID");
        return;
    }

    db.collection(ORDERS).findOne({_id: oid}, (err, data) => {
        if (err) {
            console.log(`User with ID: ${targetID} not found`);
        }
        let orderData = data;
        res.render("pages/order", {
            username: req.session.username,
            restaurantName: orderData.orderInfo.restaurantName,
            subtotal: orderData.orderInfo.subtotal.toFixed(2),
            total: orderData.orderInfo.total.toFixed(2),
            fee: orderData.orderInfo.fee.toFixed(2),
            tax: orderData.orderInfo.tax.toFixed(2),
            list: Object.values(orderData.orderInfo.order)
        });
    })

}

MongoClient.connect(MONGO_URL, (err, client) => {
    if(err) throw err;

    db = client.db("a4");

    app.listen(3000);
    console.log(`Server listening at http://localhost:3000`);
})

