const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
  console.log("inside register user");
  const { username, email, phoneNumber, password, location, profilePic } =
    req.body;
  console.log("req", req.body);
  console.log(
    "email",
    email,
    username,
    phoneNumber,
    password,
    location,
    profilePic
  );

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }
  const EuserExists = await User.findOne({ email });
  const MuserExists = await User.findOne({ phoneNumber });

  if (EuserExists) {
    res.status(400);
    throw new Error("User with the given Email already exists");
  } else if (MuserExists) {
    res.status(400);
    throw new Error("User with the given Phonenumber already exists");
  }

  try {
    const user = await User.create({
      username,
      email,
      phoneNumber,
      password,
      location,
      profilePic,
    });
    console.log("Created user:", user);
    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        location: user.location,
        isAdmin: user.isAdmin,
        pic: user.profilePic,
        token: generateToken(user._id),
      });

      console.log("returned 200 user");
    }
  } catch (error) {
    console.error("Error creating user:", error.message);
    res
      .status(500)
      .json({ message: "Failed to create user", error: error.message });
  }
});

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  console.log('req',req)
  const { email, password } = req.body;

  console.log(email, password);

  const user = await User.findOne({ email });

  console.log(user);

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

module.exports = { allUsers, registerUser, authUser };
