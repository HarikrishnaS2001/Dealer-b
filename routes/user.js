const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const userRouter = express.Router();

userRouter.route("/").get(protect, allUsers);
userRouter.post("/", registerUser);
userRouter.post("/login", authUser);

module.exports = userRouter;
