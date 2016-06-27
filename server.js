var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('./db.js');

var PORT = process.env.PORT || 3000;
var routeTodos = require('./routes/todos.js');
var routeTodosID = require('./routes/todosID.js');

app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/todos', routeTodos);
app.use('/todos', routeTodosID);


/*
	What we are building here is a simple web service. For example if user sends a GET
	request to path '/' web service is going to send user the message 'Todo API Root'
	express().get : takes two parameters . First one is the path and second one is an 
	anonymous callback function that takes two parameters called request and response.
	Request deals with what we request from user, and response is basicly the response
	to user's requests.
*/

app.get('/', function(req, res) {
	res.status(204).send();
});

/*
	app.listen
	listens the port which express using until you end it.
*/
db.todo.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express listening port ' + PORT + '!');
	});
});