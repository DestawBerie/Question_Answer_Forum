//db connnection
const e = require("express");
const dbconnection = require("../db/dbconfig");
const bcrypt = require("bcrypt");
const { statusCodes, StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;

  if (!email || !password || !firstname || !lastname || !username) {
    return res
      .status(statusCodes.BAD_REQUEST)
      .json({ msg: "please provide all required information" });
  }

  try {
    const [user] = await dbconnection.query(
      "select username, userid from users where username=? or email=?",
      [username, email]
    );
    if (user.length > 0) {
      return res
        .status(statusCodes.BAD_REQUEST)
        .json({ msg: "already registored" });
    }
    if (password.length <= 8) {
      return res
        .status(statusCodes.BAD_REQUEST)
        .json({ msg: "password must be at least 8 characters" });
    }

    //encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);
    await dbconnection.query(
      "INSERT INTO users(username, firstname, lastname, email, password) VALUES (?,?,?,?,?)",
      [username, firstname, lastname, email, hashedpassword]
    );
    return res.status(statusCodes.CREATED).json({ msg: "user created" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(statusCodes.REGISTERD)
      .json({ msg: " somthing went wrong try again" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(statusCodes.BAD_REQUEST)
      .json({ msg: "please enter the pas and email" });
  }
  try {
    const [user] = await dbconnection.query(
      "select username, userid, password from users where email=?",
      [email]
    );
    if (user.length == 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "invalid messages" });
    }
    //compare password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res
        .status(statusCodes.BAD_REQUEST)
        .json({ msg: "invalid credintioal" });
    }
    const username = user[0].username;
    const userid = user[0].userid;
    const token = jwt.sign({ username, userid }, "secret", { expiresIn: "1d" });
    return res
      .status(statusCodes.ok)
      .json({ msg: "user login successful", token });

    // return res.json({ user: user[0].password });
  } catch (error) {
    console.log(error.message);
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "somthing went wrong, try again latter" });
  }
}

async function checkUser(req, res) {
  const username=require.user.username;
  const userid= req.user.userid;
  res.status(statusCodes.ok).json({msg:"valid user", username, userid})
  //res.send("check user");
}

module.exports = { register, login, checkUser };
