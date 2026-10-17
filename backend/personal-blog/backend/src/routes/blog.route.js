import express from "express";
import { createBlogs, deleteBlog, getAllBlogs, getBlogById, updateBlog } from "../controllers/blog.controller.js";


const BlogRouter = express.Router();

BlogRouter.post("/", createBlogs);
BlogRouter.get("/", getAllBlogs);
BlogRouter.get("/:id", getBlogById);
BlogRouter.put("/:id", updateBlog);
BlogRouter.delete("/:id", deleteBlog);

export default BlogRouter;