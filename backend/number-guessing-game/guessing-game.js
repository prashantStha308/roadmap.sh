import { input } from '@inquirer/prompts';

// Initialize
const MIN = 1
const MAX = 100
const difficultyArr = ["Easy", "Medium", "Hard", "Zen"]
let gameState = {}


function initGame(){
	gameState = {
		isRunning: true,
		maxAttempt: -1,
		number: Math.floor(Math.random() * (MAX - MIN + 1)) + MIN,
		attemptCount: 0,
		guesses: [],
		hardness: -1
	}
}

async function initQuestions(){
	console.log(`
Please select the difficulty level:
1. Easy (10 chances)
2. Medium (5 chances)
3. Hard (3 chances)
4. Zen (No limit)
	`)

	gameState.hardness = await input({message: "Select a difficulty: "})

	switch( parseInt(gameState.hardness) ){
		case 1:
			gameState.maxAttempt = 10;
			break;

		case 2:
			gameState.maxAttempt = 6;
			break;

		case 3:
			gameState.maxAttempt = 3;
			break;
		
		case 4:
			gameState.maxAttempt = Infinity;
			break;

		default:
			console.error("Please select from the available option.")
			process.exit(1);
	}

	console.log(`
Welcome to the Number Guessing Game!
I'm thinking of a number between ${MIN} and ${MAX}.
You have ${gameState.maxAttempt} chances to guess the correct number.
	`)

	console.log(`Great! You have selected the ${ difficultyArr[gameState.hardness - 1] } mode`)
	console.log("Let's start the game!\n")
}

async function game(){
	while(gameState.isRunning){
		const guess = await input({message: "Enter a guess: "});
		const intInput = parseInt(guess);

		gameState.attemptCount++;

		if(intInput === gameState.number){
			console.log(`Congratulations! You guessed the correct number in ${gameState.attemptCount} attempts.`);
			stopGame();
		}else{
			console.log(`Incorrect! The number is ${ intInput > gameState.number ? "less" : "greater" } than ${intInput}`);
			console.log(`Attempt remaining: ${ gameState.maxAttempt - gameState.attemptCount}\n`)
		}

		if( gameState.maxAttempt - gameState.attemptCount <= 0){
			console.log("You've ran out of attempts")
			stopGame();
		}
	}
}

function stopGame(){
	console.log("Game Over");

	gameState.isRunning = false;
	process.exit(0);
}


async function main(){
	initGame();
	
	await initQuestions();
	await game();
}

await main();t