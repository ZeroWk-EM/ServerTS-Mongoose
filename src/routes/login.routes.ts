import express from "express";
import dotenv from "dotenv";
import { IUser } from "../interfaces/user.interface";
import User from "../models/user.model";

dotenv.config();
const router = express.Router();
router.use(express.json());

router.post("/", async ({ query }, res) => {});

export default router;
