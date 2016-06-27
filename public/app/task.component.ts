import {Component, OnInit} from '@angular/core'
import { Router } from '@angular/router-deprecated';

import { TaskDetailComponent } from './task-detail.component';
import { TaskService } from './task.service';
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
		private taskService: TaskService){}

	getTasks(){
    	this.taskService.getTasks().then(tasks => this.tasks = tasks);
	}

	ngOnInit() {
	    this.getTasks();
	}

	onSelect(task: Task) { this.selectedTask = task; }

	gotoDetail() {
    	this.router.navigate(['TaskDetail', { id: this.selectedTask.id }]);
	}
}
