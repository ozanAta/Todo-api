/*
	To make the code more proffesional and easy to read, we divide our code into
	smaller parts. This is the reason why we have a "tasks.ts" file. In "tasks.ts"
	we export the class "Task" so we can use it from other files.
*/
export class Task{
	description: string;
	completed: boolean;
	id: number;
}