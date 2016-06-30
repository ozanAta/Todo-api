import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router-deprecated';
import { Http , Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

/*	Local Libraries	*/
import { TaskDetailComponent } from './task-detail.component';
import { CreateTaskComponent } from './create-task.component';
import { Task } from './task';

@Component({
	selector: 'my-task',
	templateUrl: 'app/task.component.html',
	directives: [CreateTaskComponent]
})

export class TaskComponent implements OnInit {
	tasks :Task[];
	selectedTask: Task;
	panelOpacity =  true;

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

	makeVisible(){
		this.panelOpacity = !this.panelOpacity;
	}

	onSelect(task: Task) { this.selectedTask = task; }

	gotoDetail() {
    	this.router.navigate(['TaskDetail', { id: this.selectedTask.id }]);
	}
}
