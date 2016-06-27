import {Component, OnInit} from '@angular/core'
import { TaskDetailComponent } from './task-detail.component';
import { TaskService } from './task.service';
import { Task } from './task';

@Component({
	selector: 'my-task',
	template: `
		<ul class='tasks'>
			<li *ngFor='let task of tasks' [class.selected]='task === selectedTask' (click)='onSelect(task)'>
				<span class='badge'>{{task.id}}</span> Task
			</li>
		</ul>
		<task-detail [task]='selectedTask'></task-detail>
	`,
	directives: [TaskDetailComponent]
})

export class TaskComponent implements OnInit {
	tasks :Task[];
	selectedTask: Task;

	constructor(private taskService: TaskService){}

	getTasks(){
    	this.taskService.getTasks().then(tasks => this.tasks = tasks);
	}

	ngOnInit() {
	    this.getTasks();
	}

	onSelect(task: Task) { this.selectedTask = task; }
}
