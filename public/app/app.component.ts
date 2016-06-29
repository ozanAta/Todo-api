import {Component, OnInit} from '@angular/core'
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';

import { TaskComponent } from './task.component';
import { DashboardComponent} from './dashboard.component';
import { TaskDetailComponent } from './task-detail.component';

@Component({
	selector: 'my-app',
	template: `
		<h1>Internship Project</h1>
		<a [routerLink]="['Dashboard']">Dashboard</a>
		<a [routerLink]="['Tasks']">List</a>
  		<router-outlet></router-outlet>
	`,
	directives: [ROUTER_DIRECTIVES],
	providers: [
		ROUTER_PROVIDERS,
	]
})

@RouteConfig([
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: DashboardComponent,
		useAsDefault: true
	},{
		path: '/tasks',
		name: 'Tasks',
		component: TaskComponent
	},{
		path: '/detail/:id',
		name: 'TaskDetail',
		component: TaskDetailComponent
	},
])

export class AppComponent{
}