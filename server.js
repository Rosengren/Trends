// modules ===========================================
var express 				= require('express'),
		app 						= express(),
		bodyParser 			= require('body-parser'),
		methodOverride 	= require('method-override'),
		mongoose				= require('mongoose');
// configuration =====================================

// config files
var db = require('./config/db');

// set port
var port = process.env.PORT || 3000;

// connect to mongoDB database
// uncomment when credentials have been set in config/db.js
mongoose.connect(db.url);

// get all data of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api + json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request.
// simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

// routes ============================================
require('./app/routes')(app); // configure routes

// start app =========================================
// startup app at http://localhost:3000
app.listen(port);
console.log("Site up on http://localhost:3000");

// expose app
exports = module.exports = app;