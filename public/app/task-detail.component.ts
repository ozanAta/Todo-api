import { Component, Input } from '@angular/core';
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
  template:`
 	<div *ngIf="task" class = "result">
		<h3>Task {{task.id}} Details</h3>
		<div>
			<label>description</label>
			<span>{{task.description}}</span>
		</div>
		<div>
			<label>completed: </label>
			<span>{{task.completed}}</span>
		</div>
    </div>
  `
})

export class TaskDetailComponent {
	@Input() 
	task: Task;	 
}