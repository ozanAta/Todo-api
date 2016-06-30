import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router-deprecated';
import { Http , Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

/*	Local Libraries	*/
import { Task } from './task';
import { TaskDetailComponent } from './task-detail.component';
import { CreateTaskComponent } from './create-task.component';
import { ChangeVisibilityService } from './common-service.component';

@Component({
	providers:[ChangeVisibilityService],
	selector: 'my-task',
	templateUrl: 'app/task.component.html',
	directives: [CreateTaskComponent]
})

export class TaskComponent implements OnInit {
	tasks :Task[];
	selectedTask: Task;

	constructor(
		private router: Router,
		private http: Http,
		private CommonService:ChangeVisibilityService
	){
		this.getTasks();
	}

	getTasks(){
    	this.http.get('http://localhost:3000/todos').map((res:Response) => {return res.json();}).subscribe((response) => {
			this.tasks = response;
			return response;
		});
	}

	ngOnInit() {
	    this.getTasks();
	}

	changeVisibility(){
		this.CommonService.apperancy.next(false);
	}

	onSelect(task: Task) { this.selectedTask = task; }

	gotoDetail() {
    	this.router.navigate(['TaskDetail', { id: this.selectedTask.id }]);
	}
}
