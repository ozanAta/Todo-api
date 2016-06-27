import {Component, OnInit} from '@angular/core'
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';

import { TaskDetailComponent } from './task-detail.component';
import { TaskService } from './task.service';

@Component({
	selector: 'my-task',
	template: `
		<h1>Online To Do List App!</h1>
		<h2>Task List</h2>
		<a [routerLink]="['Dashboard']">Dashboard</a>
		<a [routerLink]="['Tasks']">Tasks</a>
 		<router-outlet></router-outlet>
	`,
	directives: [TaskDetailComponent],
	providers: [
		ROUTER_PROVIDERS,
		TaskService
	]
})

@RouteConfig([
	{
		path: '/tasks',
		name: 'Tasks',
		component: TaskComponent
	},{
		path: '/dashboard',
		name: 'Dashboard',
		component: DashboardComponent,
		useAsDefault: true
	}
])

export class AppComponent{


}
