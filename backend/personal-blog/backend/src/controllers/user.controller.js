import User from "../lib/user.js";
import {randomUUID} from "node:crypto";
import { join } from 'node:path';
import fs from "fs/promises";


let users = [];
const filePath = join( process.cwd(), "src", "storage", "users.json" );

export const loadUsers = async () => {
	await fs.mkdir( dirname( filePath ), { recursive: true } );

	try{
		const fileContent = await fs.readFile(filePath);
		users = JSON.parse(fileContent);
	}catch(err){
		if( err.code !== "ENOENT" ) throw err;

		users = [];
		await fs.writeFile( filePath, "[]" );
	}

	console.log("Loaded users from file");
}

const updateFile = async()=>{
	await fs.writeFile(filePath, JSON.stringify(users, null, 4) );
}

export const createUser = async (req, res)=>{
	try{
		const { name, password, role } = req.body;
		const newUser = new User(name, password, role, randomUUID() );

		users.push(newUser);
		await updateFile();

		return res.status(201).json({
			success: true,
			data: newUser
		})

	}catch(err){
		console.log( "Failed to create user: ", err );
		return res.status(500).json({ success: false, error: err.message })
	}
}

export const login = (req, res) => {
	try{
		const { name, password } = req.body;
		const target = users.find( u => u.name === name && u.password === password );

		if(!target){
			throw new Error("User not found");
		}

		return res.status(200).json({
			success: true,
			data: target
		})

	}catch(err){
		console.log( "Failed to login: ", err);
		return res.status(500).json({ success: false, error: err.message })
	}
}