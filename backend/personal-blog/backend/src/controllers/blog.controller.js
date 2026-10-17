import {randomUUID} from "node:crypto";
import Blog from "../lib/blog.js";
import path from "node:path";
import fs from "fs/promises";

let blogs = [];
const basePath = path.join( process.cwd(), "src", "storage" );
export const blogsDir = path.join( process.cwd(), "src/storage/blogs" );

// File handlers haha
export const loadBlogs = async() => {
	const filePath = `${basePath}/blogs.json`;

	await fs.mkdir( basePath, { recursive: true } );

	try{
		const fileContent = await fs.readFile(filePath);
		blogs = JSON.parse(fileContent);
	}catch(err){
		if( err.code !== "ENOENT" ) throw err;

		blogs = [];
		await fs.writeFile( filePath, "[]" );
	}

	console.log("Loaded blogs barrel from file");
}

const writeBlogToFile = async ( content, id )=>{
	await fs.mkdir( blogsDir, { recursive: true } );
	await fs.writeFile( path.join( blogsDir, `${id}.md` ), content );

	return `/files/blogs/${id}.md`;
}

const updateBarrel = async() =>{
	await fs.writeFile(`${basePath}/blogs.json`, JSON.stringify(blogs, null, 4))
}

const deleteBlogFile = async(id) => {
	await fs.rm( `${blogsDir}/${id}.md`, { force: true } );
}

// Actual Controllers lol
export const createBlogs = async (req,res) => {
	try{

		const { author, name, content } = req.body;
		const id = randomUUID();
		const src = await writeBlogToFile(content, id);

		const newBlog = new Blog(id, author, name, src, new Date(), new Date());
		blogs.push(newBlog);
		await updateBarrel();	

		return res.status(201).json({
			success: true,
			data: newBlog
		});
	}catch(err){
		console.log( "Failed to create blog: ", err );
		return res.status(500).json({ success: false, error: err.message })
	}
}

export const getAllBlogs = async(req, res) => {
	try{
		return res.status(200).json({ success: true, data:blogs })
	}catch(err){
		console.log( "Failed to get all blogs: ", err );
		return res.status(500).json({ success: false, error: err.message })
	}
}

export const getBlogById = async(req, res) => {
	try{

		const { id } = req.params;
		const target = blogs.find( b => b.id === id );

		if(!target){
			throw new Error("Blog not found");
		}

		return res.status(200).json({
			success: true,
			data: target
		})

	}catch(err){
		console.log( "Failed to get blog: ", err );
		return res.status(500).json({ success: false, error: err.message })
	}
}

export const updateBlog = async(req,res) => {
	try{

		const { id } = req.params;
		const { name, content, author } = req.body;

		const target = blogs.find( b => b.id === id );
		const index = blogs.indexOf(target);

		if( index === -1 ){
			throw new Error("Blog not found");
		}

		await deleteBlogFile(id);
		const file = await writeBlogToFile(content, id)

		blogs[index] = {
			id: target.id,
			name, file,
			author,
			dateCreated: target.dateCreated,
			dateUpdated: new Date()
		}

		await updateBarrel();
		return res.status(200).json({
			success: true,
			data: blogs[index]
		})

	}catch(err){
		console.log( "Failed to update blog: ", err );
		return res.status(500).json({ success: false, error: err.message })
	}
}

export const deleteBlog = async( req, res ) =>{
	try{
		const { id } = req.params;

		const target = blogs.find( b => b.id === id );
		if( !target ){
			return res.status(404).json({ success: false, error: "Blog not found" });
		}

		await deleteBlogFile(id);
		blogs = blogs.filter( b => b.id !== id );
		await updateBarrel();

		return res.status(200).json({
			success: true,
		})
	}catch(err){
		console.log( "Failed to delete blog: ", err );
		return res.status(500).json({ success: false, error: err.message })
	}
}