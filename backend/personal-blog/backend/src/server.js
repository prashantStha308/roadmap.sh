import express, { urlencoded } from "express";
import cors from "cors"

import { loadUsers } from "./controllers/user.controller.js";
import { blogsDir, loadBlogs } from "./controllers/blog.controller.js";
import UserRouter from "./routes/user.route.js";
import BlogRouter from "./routes/blog.route.js";

const PORT = 3000;
const app = express();

// middlewares
app.use( cors({
	origin: "http://localhost:4321"
}))
app.use( express.json() );
app.use( urlencoded({extended: true}) )

app.use( "/files/blogs", express.static( blogsDir ) );

// Routes
app.use("/api/user", UserRouter);
app.use("/api/blog", BlogRouter);


const start = async () => {
	await loadUsers();
	await loadBlogs();
	app.listen(PORT, ()=>{
		console.log(`Server running on: http://localhost:${PORT}`)
	})
}

start().catch( (err) => {
	console.error(err);
	process.exit(1);
});