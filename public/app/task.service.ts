import { Injectable } from '@angular/core';

import { Task } from './task';

import { Tasks } from './mock-tasks';

@Injectable()
export class TaskService {
	getTasks() {
		return Promise.resolve(Tasks);
	}
}