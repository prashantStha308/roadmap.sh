import express from "express";
import { createUser, login } from "../controllers/user.controller.js";


const UserRouter = express.Router();

UserRouter.post("/", createUser);
UserRouter.post("/login", login);

export default UserRouter;