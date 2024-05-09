const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//get all users
const getUsers = async (req, res) => {
  let users; //declare outside the try block to make it accessible inside and outside the block
  try {
    users = await User.find({}, "-password"); //query the database to get all users
    //if we return the response here, we will lose
  } catch (err) {
    //if there is an error in the query
    return res
      .status(500)
      .json({ message: "Fetching users failed, please try again later." });
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};
//---------------------------------------------------------

//create a new user(signup)

const signup = async (req, res) => {
  //1-check if there are any validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  //2-check if the user already exists
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email }); //query the database to find the user
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Signing up failed, please try again later." });
  }

  if (existingUser) {
    return res
      .status(422)
      .json({ message: "User exists already, please login instead." });
  }

  //3-hash the password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12); //hash the password
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Signing up failed, can not hash the password." });
  }

  //4-create a new user
  const createdUser = new User({
    name,
    email,
    image: req.file.path, //store the path of the image in the database instead of the image itself and store the image in the uploads folder
    password: hashedPassword,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Signing up failed, can not save user." });
  }

  //5-create a token
  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Signing up failed, can not create token." });
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

//---------------------------------------------------------

//login
const login = async (req, res) => {
  const { email, password } = req.body;
  // console.log(email + " " + password);

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Logging in failed, please try again later." });
  }

  if (!existingUser) {
    return res
      .status(401)
      .json({ message: "user does not exist, please sign up." });
  }

  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return res.status(500).json({
      message: "Problem with comparing the password, please try again later.",
    });
  }

  if (!isValidPassword) {
    return res
      .status(401)
      .json({ message: "Password is incorrect, please try again." });
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "supersecret_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Logging in failed, please try again later." });
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
