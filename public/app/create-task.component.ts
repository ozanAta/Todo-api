import { Component } from '@angular/core';
import { Http , Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

/*	Local Libraries	*/
import { ChangeVisibilityService } from './common-service.component';

@Component({
	selector:'add-task',
	template:`
		<div [hidden]='isHidden' class='addPanel'>
			<div class='taskInfoPanel'>
				<h3>Enter Task Information</h3><br>
				Description: <input [(ngModel)]="Description" type='text'><br>
				Completed: 
	    		<input type="checkbox" [(ngModel)]="Completed"><br>
				<button type="submit" (click)='onClick()'>OK</button>
			</div>
		</div>
	`,
})

export class CreateTaskComponent{
	Description:string;
	Completed:boolean;
	isHidden :boolean = true;
	constructor(
		private http: Http,
		private CommonService:ChangeVisibilityService
	){
		console.log(2);
		this.CommonService.apperancy.subscribe( (value:boolean) => {
			console.log("asşdkasdjasjhdj");
			this.isHidden = value;
		} );
	}

	onClick(){
		var task = {
			description: this.Description,
			completed: !!this.Completed
		}
		this.http.post('http://localhost:3000/todos',task).map((res:Response) => {return res.json();}).subscribe((response) => {});
		this.changeVisibility();
		this.Description = "";
		this.Completed = false;
	}

	changeVisibility(){
		this.CommonService.apperancy.next(!this.isHidden);
	}
}

