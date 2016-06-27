var express = require('express');
var app = express();
var router = express.Router();

var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('../db.js');

var PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

/*
	GET by id /todos/:id
	We are using ":id" instead of "id" alone because that is what express uses to parse
	the data coming in
	req.params is a short for url parameters. *it's always a string*
	parseInt(string,10) string to int. *10 stands for decimal*
	if(!!object) turns object into boolen value. Like if exists -> true
*/
router.get('/:id', function(req, res) {
	var id = parseInt(req.params.id, 10);
	db.todo.findById(id).then(function(task) {
		if (!!task) res.json(_.pick(task.toJSON(), 'description', 'completed', 'id'));
		else res.status(404).send();
	}, function(errorMessage) {
		console.log(errorMessage);
	});
})

/*
	DELETE by id /todos/:id
*/
router.delete('/:id', function(req, res) {
	var id = parseInt(req.params.id, 10);
	db.todo.destroy({
		where: {
			id: id
		}
	}).then(function(deletedFlag) {
		if (deletedFlag === 0) res.status(404).json({
			error: 'No task to delete'
		});
		else {
			res.status(204).send();
		}
	}, function() {
		res.status(404).send();
	});
});

/*
	POST by id /todos/:id
	Updates an existing element. There is three possible situations
		1-Update both description and completed
		2-Update description
		3-Update completed
*/
router.post('/:id', function(req, res) {
	var id = parseInt(req.params.id, 10);
	var body = req.body;
	db.todo.findById(id).then(function(task) {
		if (!!task) {
			if (_.keys(body).length === 2 && _.isString(body.description) && _.isBoolean(body.completed) && body.description.trim().length > 0) {
				task.description = body.description
				task.completed = body.completed
				task.save({
					fields: ['description', 'completed']
				}).then(function() {
					res.json(task.toJSON());
				})
			} else if (_.isString(body.description) && body.description.trim().length > 0) {
				task.description = body.description
				task.completed = body.completed
				task.save({
					fields: ['description']
				}).then(function() {
					res.json(task.toJSON());
				})
			} else if (_.isBoolean(body.completed)) {
				task.description = body.description
				task.completed = body.completed
				task.save({
					fields: ['completed']
				}).then(function() {
					res.json(task.toJSON());
				})
			}
		} else return res.status(404).send();
	});
});

module.exports = router;