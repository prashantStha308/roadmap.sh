#!/usr/bin/env node

async function displayUserEvents(username){
	const url = `https://api.github.com/users/${username}/events`;
	const res = await fetch(url);

	if( res.status !== 200 ) throw new Error(res.statusText)

	const data = await res.json();
	console.log(JSON.stringify(data, null, 4))
}

const args =  process.argv.slice(2)

if( !args[0] ){
	console.error("username is required\n Use: github-activity USERNAME")
}else{
	displayUserEvents(args[0]);
}