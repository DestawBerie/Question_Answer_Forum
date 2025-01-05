const express = require("express");
const app = express();
const port = 5500;

//app.get("/", (req, res) => {
//   res.send("wellcome Destaw");
//});

//db connectons
const dbconnection = require("./routes/userRoute");

//user routes middleware
const userRoutes = require("./routes/userRoute");


//question routes middleware
const questionRoutes = require("./routes/questionRoute");
const authMiddleware = require("./middleware/authMiddleware");



//json middle ware extract json data
app.use(express.json())

app.use("/api/users", userRoutes);


//json middle ware questions

app.use("/api/questions", authMiddleware, questionRoutes);


async function start() {
   try {
    //const result = await dbconnection.excute("select 'test'");
    await app.listen(port);
    console.log("database connection stablished");
    console.log(`listening on ${port}`);
   } catch (error) {
    console.log(error.message);
  }
}
start();

//app.listen(port, (err) => {
//if (err) {
//console.log(err);
//} else {
//  console.log(`listening on ${port}`);
//}
//});
