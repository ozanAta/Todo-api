import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router-deprecated';
import { Http } from '@angular/http';
import 'rxjs/Rx';

import { TaskDetailComponent } from './task-detail.component';
import { Task } from './task';

@Component({
	selector: 'my-task',
	templateUrl: 'app/task.component.html'
})

export class TaskComponent implements OnInit {
	tasks :Task[];
	selectedTask: Task;

	constructor(
		private router: Router,
		private http: Http
		){}

	getTasks(){
    	this.http.get('http://localhost:3000/todos').map((res:Response) => {return res.json();}).subscribe((response) => {
			this.tasks = response;
			return response;
		});
    	
	}

	ngOnInit() {
	    this.getTasks();
	}

	onSelect(task: Task) { this.selectedTask = task; }

	gotoDetail() {
    	this.router.navigate(['TaskDetail', { id: this.selectedTask.id }]);
	}
}
