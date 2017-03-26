var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var path = require('path');

var port = 3000;

var app = express();

//view engine
app.set('view engine', 'ejs');
//set path to views Folder
app.set('views', path.join(__dirname, 'views'));



/* Middleware trigger when response arrives .. PLACE MATTERS
var logger = (req,res,next) => {
	console.log('Logging.......');
	next();
}
app.use(logger);
*/



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//set static path .. Public Data Folder (override app js display cont)
app.use(express.static(path.join(__dirname, 'public')));

// Global Vars
app.use(function(req,res,next){
	res.locals.errors = null;
	next();
});

//Express validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//sample data
var people = [
	{
		name : 'jeff',
		age : 22
	},
	{
		name : 'matt',
		age : 25
	}
];

app.get('/', (req,res) => {
	res.render('index', {
		title : 'Test Title',
		people : people
	});
});

app.post('/users/add', (req,res) => {
	req.checkBody('first_name', 'First Name is required').notEmpty();
	req.checkBody('last_name', 'Last Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	
	var errors = req.validationErrors();
	
	if(errors){
		console.log('ERRORS');
		
		res.render('index', {
			title : 'Test Title',
			people : people,
			errors : errors
		});
	}
	else {
		var newUser = req.body;
		console.log('SUCCESS');
		console.log(newUser);
	}
	
	
});

//send text/html
/*
app.get('/', (req,res) => {
	res.send('Hello');
});
*/


//================For API Use
/*
//send json For API
app.get('/', (req,res) => {
	res.json(people);
});
*/
//===============================

app.get('/', (req,res) => {
	res.send('Hello');
});

app.listen(port, () => {
	console.log ("Server Started on port " + port)
});
