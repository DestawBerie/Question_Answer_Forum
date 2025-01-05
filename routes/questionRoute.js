const express = require("express");
const router = express.Router();
//authentication middle ware



router.get("/all-questions", (req, res) => {
  res.send("all-questions");
});

module.exports = router;
