import { Injectable } from '@angular/core';

import { Task } from './task';

import { Tasks } from './mock-tasks';

@Injectable()
export class TaskService {
	getTasks() {
		return Promise.resolve(Tasks);
	}
	getTask(id: number) {
		return this.getTasks().then(tasks => tasks.filter(task => task.id === id)[0]);
	}
}