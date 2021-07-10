const dotenv = require("dotenv");
// const mongoose = require("mongoose");
const express = require("express");

const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(cookieParser());
app.use(cors());

dotenv.config({ path: "./config.env" });
require("./db/conn");

app.use(express.json()); //middleware. to understand json data

app.use(require("./router/auth")); //link router files to ur router

const PORT = process.env.PORT;

// const DB =
//   "mongodb+srv://shubham:shubhamongo@cluster0.hhvhk.mongodb.net/mernstack?retryWrites=true&w=majority";

// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//   })
//   .then(() => {
//     console.log("Connection successful");
//   })
//   .catch((error) => {
//     console.log("Failed to connect : " + error);
//   });

//Middleware
// const middleware = (req, res, next) => {
//   console.log("I am Middleware"); //checks whether user has logged in/ not. if yes, then show about page else it will load
//   next(); //after checking logged in/not next() calls about page
// };

app.get("/", function (req, res) {
  res.send("Hello World from the server app..");
});

// app.get("/about", middleware, function (req, res) {
//   console.log("I am About.");
//   res.send("Hello about World from the server..");
// });
app.get("/contact", function (req, res) {
  res.send("Hello contact World from the server..");
});
app.get("/signin", function (req, res) {
  res.send("Hello signin World from the server..");
});
app.get("/signup", function (req, res) {
  res.send("Hello signup World from the server..");
});

app.get("/logout", function (req, res) {
  res.send("Hello logout World from the server..");
});

app.listen(PORT, () => {
  console.log(`Server is running at port no: ${PORT}`);
});

console.log("Check whether nodemon is working or not");
