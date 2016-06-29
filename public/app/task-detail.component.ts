import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { Task } from './task';

/*
	"app.components" is our main component file, so we need to keep it as readable as possible. 
	This is the reason why we have "task-detail.component" file. Instead of adding template of
	"task-detail.component" directly into "app.component"s template section. We create a new 
	component like "<task-detail [task]="selectedTask"></task-detail>" and add it instead. This
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

	private handleError(error: any) {
		console.error('An error occurred', error);
		return Promise.reject(error.message || error);
	}

	getTasks(): Promise<Task[]> {
	return this.http.get('http://localhost:3000/todos')
	   .toPromise()
	   .then(response => {return response.json().data})
	   .catch(this.handleError);
	}

	getTask(id: number) {
		return this.getTasks()
	         .then(tasks => tasks.filter(task => task.id === id)[0]);
	}

	ngOnInit() {

		// if (this.routeParams.get('id') !== null) {
		// 	let id = +this.routeParams.get('id');
		// 	this.navigated = true;
		// 	this.getTask(id).then(task => this.task = task);
		// }
    	this.http.get('http://localhost:3000/todos').map((res:Response) => {return res.json();}).subscribe((response) => {
    		let id = +this.routeParams.get('id');
			this.task = response.filter(task => task.id === id)[0];
			return this.task;
		});

	}
	/*
		Allows user to navigate backwards one step in the browsers history stack.
	*/
	goBack() {
  		window.history.back();
	}
}



