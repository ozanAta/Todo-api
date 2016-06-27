import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router-deprecated';

import { Task } from './task';
import { TaskService } from './task.service';
import { TaskDetailComponent } from './task-detail.component';

@Component({
	selector: 'my-dashboard',
	templateUrl:'app/dashboard.component.html'
})
export class DashboardComponent implements OnInit {
	tasks: Task[] = [];
	selectedTask: Task;
	
	constructor(
		private router: Router,
		private taskService: TaskService
	){}
	
	ngOnInit() {
		this.taskService.getTasks().then(tasks => this.tasks = tasks.slice(1, 5));
	}
	
	onSelect(task: Task) { this.selectedTask = task; }

	gotoDetail() {
		this.router.navigate(['TaskDetail', { id: this.selectedTask.id }]);
	}
}