import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router-deprecated';
import { Http } from '@angular/http';
import 'rxjs/Rx';

import { TaskDetailComponent } from './task-detail.component';
import { Task } from './task';

@Component({
	selector: 'my-dashboard',
	templateUrl:'app/dashboard.component.html'
})
export class DashboardComponent implements OnInit {
	tasks: Task[] = [];
	selectedTask: Task;
	
	constructor(
		private router: Router,
		private http: Http
	){}
	
	ngOnInit() {
    	this.http.get('http://localhost:3000/todos').map((res:Response) => {return res.json();}).subscribe((response) => {
			this.tasks = response.slice(0, 4);
			return response;
		});
	}
	
	onSelect(task: Task) { this.selectedTask = task; }

	gotoDetail() {
		this.router.navigate(['TaskDetail', { id: this.selectedTask.id }]);
	}
}