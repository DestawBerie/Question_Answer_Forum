const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
function authMiddleware(req, res, next) {
  const authHeader = req.header.authorization;

  if (!authHeader || !authHeader.startswith("Bearer")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "authentication invalid" });
  }

  const token = authHeader.splite(" ")[1];
  console.log(authHeader);
  console.log(token);
  try {
    const { username, userid } = jwt.verify(authHeader, "secret");
    req.user = { username, userid };
    next();
    return res.status(StatusCodes);
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "authentication invalid" });
  }
}
module.exports = authMiddleware;
