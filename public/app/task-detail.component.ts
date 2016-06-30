import { Component, OnInit } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

/* Local Libraries */
import { Task } from './task';

/*
	'app.components' is our main component file, so we need to keep it as readable as possible. 
	This is the reason why we have 'task-detail.component' file. Instead of adding template of
	'task-detail.component' directly into 'app.component's template section. We create a new 
	component like '<task-detail [task]='selectedTask'></task-detail>' and add it instead. This
	way our code is easier to read and modify.
*/
@Component({
  selector: 'task-detail',
  templateUrl: 'app/task-detail.component.html'
})

export class TaskDetailComponent implements OnInit {
	task:Task;
	tasks:Task[];
	navigated = false;
	
	constructor(
		private routeParams: RouteParams,
		private http: Http
	){}

	ngOnInit() {
		this.http.get('http://localhost:3000/todos').map((res:Response) => {return res.json();}).subscribe((response) => {
			let id = +this.routeParams.get('id');
			this.task = response.filter(task => task.id === id)[0];
			return this.task;
		});
	}

	getTasks() {
	return this.http.get('http://localhost:3000/todos')
	   .toPromise()
	   .then(response => {return response.json().data})
	}

	getTask(id: number) {
		return this.getTasks()
	         .then(tasks => tasks.filter(task => task.id === id)[0]);
	}

	delete() {
		var id = this.task.id;
		this.http.delete('http://localhost:3000/todos/' + encodeURIComponent(id)).map((res:Response) => res).subscribe((response) => {
		});
		this.goBack();
	}

/*	Allows user to navigate backwards one step in the browsers history stack.	*/
	goBack() {
  		window.history.back();
	}
}



