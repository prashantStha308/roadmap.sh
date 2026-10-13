import fs from "fs/promises"
import {randomUUID} from "node:crypto";
import Table from "cli-table3";


const formatter = new Intl.DateTimeFormat("en-CA", {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});


class TrackedItem{
	constructor(description, amount, date){
		this.id = randomUUID();
		this.date = date;
		this.description = description;
		this.amount = amount;
	}
}


class CTracker {
	filePath = "./bin/expense-data.json";
	items = new Map();

	budgetLimit = -1;

	constructor(){}

	async addItem( description, amount ){
		const newItem = new TrackedItem(description, amount, new Date());
		this.items.set(newItem.id, newItem);

		await this.updateFile();
		return newItem;
	}

	listItems(){
		const table = new Table({
		    head: ['ID', 'Date', 'Description', 'Amount']
		});

		// Append to table
		[...this.items.values()].forEach( item => {
			table.push([ item.id, formatter.format(new Date(item.date)), item.description, item.amount ]) 
		})

		console.log( table.toString() )
	}

	displaySummary( month ){
		let items = Array.from( this.items.values() );
		let monthNumber;

		if( month ){
			monthNumber = Number.isNaN( parseInt( month ) )
				? new Date( `${month} 1, 2000` ).getMonth() + 1
				: parseInt( month );

			if( Number.isNaN( monthNumber ) || monthNumber < 1 || monthNumber > 12 ){
				throw new Error( `Invalid month "${month}"` );
			}

			items = items.filter( item => new Date( item.date ).getMonth() + 1 === monthNumber );
		}

		const total = items.reduce( ( acc, item ) => acc + item.amount, 0 );
		const label = month
			? ` for ${ new Date( 2000, monthNumber - 1 ).toLocaleString( "en-US", { month: "long" } ) }`
			: "";

		console.log( `Total expenses${label}: ${total}` );
	}

	async delete( id ){
		const target = this.items.get(id);
		if(!target){
			console.error("Item not found")
			return;
		}

		this.items.delete(id);
		console.log("Deleted item successfully")

		await this.updateFile();
		return target;
	}

	async loadFromFile(){
		let input;

		try {
		   input = JSON.parse(await fs.readFile(this.filePath, 'utf-8'));

		} catch (err) {
			if( err.code === 'ENOENT' ) return;
			throw err;
		}

		this.items = new Map(Object.entries( input ));
	}

	async updateFile(){

		const input = JSON.stringify(Object.fromEntries(this.items), null, 4);
		await fs.writeFile( this.filePath, input );
	}

}
// singleton instance
const tracker = new CTracker();
await tracker.loadFromFile()

export default tracker;