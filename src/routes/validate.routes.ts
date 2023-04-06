import express from "express";
import dotenv from "dotenv";
import User from "../models/user.model";

dotenv.config();
const router = express.Router();
router.use(express.json());

router.get("/:verifyToken", async ({ params: { verifyToken } }, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { verify: verifyToken },
      { $unset: { verify: 1 } }
    );
    if (user) {
      return res.status(200).json({ message: "User enabled" });
    }
    return res
      .status(404)
      .json({ message: "This token is not associated with any user" });
  } catch (error) {
    return res.status(400).json({ message: "Error to validate user", error });
  }
});

export default router;
