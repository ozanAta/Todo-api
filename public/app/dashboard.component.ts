import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router-deprecated';
import { Http , Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

/*	Local Libraries	*/
import { Task } from './task';
import { TaskDetailComponent } from './task-detail.component';
import { CreateTaskComponent } from './create-task.component';

@Component({
	selector: 'my-dashboard',
	templateUrl:'app/dashboard.component.html',
	directives: [CreateTaskComponent]
})

export class DashboardComponent implements OnInit {
	tasks: Task[] = [];
	selectedTask: Task;
	panelOppacity = true;
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

	makeVisible(){
		this.panelOppacity = !this.panelOppacity;
	}

	gotoDetail() {
		this.router.navigate(['TaskDetail', { id: this.selectedTask.id }]);
	}
}