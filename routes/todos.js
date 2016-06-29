var express = require('express');
var app = express();
var router = express.Router();

var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('../db.js');

var PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

/*
	GET /todos 
	A simple get request for all items on todo list.
*/
router.get('/', function(req, res) {
	var todos = [];
	db.todo.findAll().then(function(todoList) {
		todoList.forEach(function(task) {
			todos.push(_.pick(task.toJSON(),'description','completed','id'));
		})
		res.json(todos);
	})
});

/*
	POST /todos
	POST request should take a json formatted object that contains a description value as
	string and a completed value as boolean.
		{
			description : string,
			completed : boolean
		}
	What happens here : if something bad happens create() function returns an error. If
	an error occurs, .catch() structure catches the error message then prints this error
	message to console and it also returns a boolean value. Then, the combined promise 
	starts working. It sends either status 400 or status 200 depending on the errors in
	the system.
*/
router.post('/', function(req, res) {
	var body = req.body;
	db.todo.create({
		description: body.description,
		completed: body.completed
	}).catch(function(errorMessage) {
		console.log(errorMessage);
		return false;
	}).then(function(flag){
		if (flag) return res.status(200).send();
		else return res.status(400).send('Inaccurate object format');
	});
});

module.exports = router;