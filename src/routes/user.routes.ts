import express from "express";
import dotenv from "dotenv";
import User from "../models/user.model";

dotenv.config();
const router = express.Router();
router.use(express.json());

router.get("/", async ({ query }, res) => {
  try {
    const findAll = await User.find(query);
    res.status(200).json(findAll);
  } catch (error) {
    console.log(error);
  }
});

export default router