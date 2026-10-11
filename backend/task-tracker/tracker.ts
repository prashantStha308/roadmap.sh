import fs from "fs/promises";
import minimist from 'minimist-lite';
import { randomUUID } from 'node:crypto';


const STATUSES = [ "todo", "in-progress", "done" ] as const;
type TStatus = typeof STATUSES[number];
type TTask = {
	id: string,
	description: string,
	status: TStatus,
	createdAt: Date,
	updatedAt: Date
}

// Define command and file constants
const baseCmd = "pnpm dev"
const filePath = "./bin/tracker-data.json"
const INDENT_SPACE = 4

// Setup minimist to structrully manage cli args
const argv = minimist(process.argv.slice(2))._;
const TaskMap = new Map<string,TTask>();


async function addTask( description: string ){
	const newTask: TTask = {
		id: randomUUID(),
		description,
		status: "todo",
		createdAt: new Date(),
		updatedAt: new Date(),
	}
	TaskMap.set(newTask.id, newTask);

	console.log("Added Task successfully")
	await updateFile()
}

// Updates only the Task description
async function updateTask( id: string, description : string ){
	const target: TTask | undefined = TaskMap.get(id);
	if(!target) throw new Error("Task not found")

	target.description = description;
	await updateFile()
}

async function deleteTask( id:string ){
	TaskMap.delete(id);
	await updateFile()
}

// Master function to update status of Tasks
async function updateStatus( id:string , status:TStatus = "todo" ){
	const target = TaskMap.get(id);
	if( !target ) throw new Error("Task with associated ID not found")

	target.status = status;
	updateFile();
}

async function markDone( id: string ){
	await updateStatus(id, "done");
}

async function markInProgress(id: string){
	await updateStatus(id, "in-progress");
}


async function listTasks(filter?:TStatus){
	let result = [...TaskMap.values()];
	if(filter){
		result = result.filter((data) => data.status === filter );
	}

	console.log(JSON.stringify( result, null, INDENT_SPACE));
}

// Writes the whole content of TaskMap to `filePath`
// Very bad for large scale
async function updateFile(){
	const input = JSON.stringify(Object.fromEntries(TaskMap), null, INDENT_SPACE);
	await fs.writeFile( filePath, input );
}

// Reads contents of `filePath`, parses raw data to object, then populates the TaskMap map
// This function runs on every command which makes it very bad for large scale
async function loadList(){
	let input;

	try {
	    input = JSON.parse(await fs.readFile(filePath, 'utf-8'));
	} catch (err: any) {
		if( err.code === 'ENOENT' ) return;
		throw err;
	}

	for(const [id, task] of Object.entries<TTask>( input ) ){
		TaskMap.set( id, {
			...task,
			createdAt: new Date( task.createdAt ),
			updatedAt: new Date( task.updatedAt ),
		} );
	}
}

// Displays a help message to the user
function displayHelp() {
	console.log("Available Options:");
	console.log(`
		${baseCmd} [args]

		help: Displays this message
		Usages: ${baseCmd} help

		add: Adds new task
		Usages: ${baseCmd} add TASK_DESCRIPTION

		update: Updates the Task description
		Usages: ${baseCmd} update TASK_ID UPDATED_VALUE

		delete: Deletes a Task from the file
		Usages: ${baseCmd} delete TASK_ID

		mark-done: Marks a Task as completed(done)
		Usages ${baseCmd} mark-done TASK_ID

		mark-in-progress: Marks a Task as in-progress
		Usages ${baseCmd} mark-in-progress TASK_ID

		list: Lists all available tasks. This takes optional parameters
		Usages: ${baseCmd} list [OPTIONAL_PARAMETERS]
		Parameters: 
			done: Lists all tasks marked as "done"
			todo: Lists all tasks marked as "todo"
			in-progress: Lists all tasks marked as "in-progress"
		Example:
		#lists all tasks marked as "done"
		${baseCmd} list done
	`)
}

// The main function
async function main(){
	await loadList();

	switch (argv[0]){
		case "add":
			if(!argv[1]) throw new Error(`Missing argument. Expected +1 parameters after \`add\` \n ${baseCmd} add NEW_TASK`)

			await addTask( argv[1] )
			break;

		case "update":
			if( !argv[1] || !argv[2] ) throw new Error(`Missing argument. Expected +2 parameters after \`update\` \n ${baseCmd} update TASK_ID UPDATED_VALUE`)

				await updateTask(argv[1], argv[2])
			break;

		case "delete":
			if(!argv[1]) throw new Error(`Missing argument. Expected +1 parameters after \`delete\` \n ${baseCmd} delete TASK_ID`)

				await deleteTask(argv[1])
			break;

		case "mark-in-progress":
			if(!argv[1]) throw new Error(`Missing argument. Expected +1 parameters after \`mark-in-progress\` \n ${baseCmd} mark-in-progress TASK_ID`)
				await markInProgress(argv[1]);
			break;

		case "mark-done":
			if(!argv[1]) throw new Error(`Missing argument. Expected +1 parameters after \`mark-done\` \n ${baseCmd} mark-done TASK_ID`)
				await markDone(argv[1]);
			break;

		case "list":

			if( argv[1] && !STATUSES.includes( argv[1] as TStatus )){
				throw new Error(`filter only accepts ${STATUSES} as parameters after \`list\` `)
			}

			await listTasks( argv[1] as TStatus | undefined )
			break;

		case "help":
			displayHelp();
			break;
		default:
			throw new Error("Invalid input parameters")
	}
}

// Invoking main() function wrapped in try-catch to deal with all error at one place. Sort of like a global error handler
try{
	await main();
}catch(err){
	console.error(err instanceof Error ? err.message : err)
	console.log()
	displayHelp();
}