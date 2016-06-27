import { Component, OnInit } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';

import { Task } from './task';
import { TaskService } from './task.service';

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
	task: Task;

	constructor(
 		private taskService: TaskService,
		private routeParams: RouteParams
	){}

	ngOnInit() {
		let id = +this.routeParams.get('id');
		this.taskService.getTask(id).then(task => this.task = task);
	}
	/*
		Allows user to navigate backwards one step in the browsers history stack.
	*/
	goBack() {
  		window.history.back();
	}
}