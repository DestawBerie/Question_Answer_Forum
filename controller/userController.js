//db connnection
const dbconnection = require("/db/dbconfig");

async function register(req, res) {
  const { username, firstname, lastname, email, pasword } = req.body;

  if (!email || !username || !firstname || !lastname || !username || !pasword) {
    return res.json({ msg: "please provide all required information" });
  }
}

async function login(req, res) {
  res.send("login");
}

async function checkUser(req, res) {
  res.send("check user");
}

module.exports = { register, login, checkUser };
