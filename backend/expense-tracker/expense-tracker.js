import { Command } from 'commander';
import tracker from "./lib.js";


const app = new Command();

app
	.name("Expense Tracker")
	.description("A simple CLI tool to track your everyday expenses")
	.version('1.0.0')

app
	.command("add")
	.description("Add a new item to track")
	.requiredOption("-d, --description <text>", "Task Description")
	.requiredOption("-a, --amount <number>", "How much did you send on this?", parseFloat)
	.action( async (opts) => {
		const item = await tracker.addItem(opts.description, opts.amount)

		console.log(`Task added successfully. (ID: ${item.id})`)
	} )

app
	.command("list")
	.description("Lists out the available items and their data")
	.action( () =>{
		tracker.listItems();
	} )


app
	.command("summary")
	.description("Displays the total expenses")
	.option("-m, --month [text]", "OPTIONAL: displays expenses of the passed month")
	.action( (opts) =>{
		tracker.displaySummary(opts.month);
	} )

app
	.command("delete")
	.description("Deletes an item")
	.requiredOption("-i, --id <text>", "ID of the task to be deleted")
	.action( (opts) =>{
		tracker.delete(opts.id);
	} )

await app.parseAsync( process.argv );
