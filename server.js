// DEPENDENCIES
const express = require('express');
const path = require('path');
const config = require('./config/db')
const passport = require('passport');
const mongoose = require('mongoose');


// defining expressSession
const expressSession = require("express-session")({
	secret: "secret",
	resave: false,
	saveUninitialized: false,
});


// importing user model
const Registration =require("./model/User");


// ******* Importing routes *******
const registerRoutes = require("./routes/registerRoutes");
const authen = require('./routes/authRoutes');
const prodUpload = require("./routes/UFarmerUploads");
const checkP = require("./routes/Checkpoints");
const reportD = require("./routes/reports");

//INSTANTIATIONS
const app = express();


// Setting up db connections
mongoose.connect(config.database,{ useNewUrlParser: true });
const db = mongoose.connection;

// Check connection
db.once('open', function(){

console.log('Connected to MongoDB');
});
// Check for db errors
db.on('error', function(err){
  console.error(err);
});


// CONFIGURATIONS
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// app.set('views','views');



//******* MIDDLEWARE************

  // To parse URL encoded data
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(expressSession);




 // Passport configuration middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(Registration.createStrategy());
passport.serializeUser(Registration.serializeUser());
passport.deserializeUser(Registration.deserializeUser());



app.use( "/", registerRoutes);
app.use("/", authen);
app.use("/", prodUpload);
app.use("/", checkP);
app.use("/", reportD);


// ROUTES


  // For invalid routes. always  be the last in the server file (index.js)
  app.get('*', (req, res) => { 
    res.redirect('/notFound');
  });

  app.listen(3100, () => console.log('listening on port 3100'));
 
