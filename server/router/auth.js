const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
// const bcrypt = require("bcrypt");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");

// require("")
require("../db/conn");
const User = require("../model/userSchema");

router.get("/", function (req, res) {
  res.send("Hello World from the server router..");
});

//USING PROMISES
// router.post("/register", (req, res) => {
//   // console.log(req.body); //this will display data in user schema format in terminal
//   // res.json({ message: req.body }); //this will display data in user schema format in postman

//   const { name, email, phone, work, password, cpassword } = req.body;

//   //if any field is left empty
//   if (!name || !email || !phone || !work || !password || !cpassword) {
//     return res.status(422).json({ error: "Pls fill all fields.." });
//   }

//   //if during first sign up, email already exists than show error
//   User.findOne({ email: email })
//     .then((userExist) => {
//       if (userExist) {
//         return res.status(422).json({ error: "Email already exists" });
//       }

//       //add new user if distinct email is entered
//       //same as const user = new User({ name:name, email:email, phone:phone, work:work, password:password, cpassword:cpassword });
//       const user = new User({ name, email, phone, work, password, cpassword });

//       user
//         .save()
//         .then(() => {
//           res.status(201).json({ message: "User registered successfully" });
//         })
//         .catch((error) => {
//           return res.status(500).json({ error: "Failed to register" });
//         });
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// });

//USING ASYNC/AWAIT
router.post("/register", async (req, res) => {
  // console.log(req.body); //this will display in terminal
  // res.json({ message: req.body }); //this will display in postman

  const { name, email, phone, work, password, cpassword } = req.body;

  //if any field is left empty
  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "Pls fill all fields.." });
  }

  try {
    //if during first sign up, email already exists than show error
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "Email already exists" });
    } else if (password !== cpassword) {
      return res
        .status(422)
        .json({ error: "Password and confirm password aren't matching" });
    } else {
      //add new user if distinct email is entered
      //same as const user = new User({ name:name, email:email, phone:phone, work:work, password:password, cpassword:cpassword });
      const user = new User({ name, email, phone, work, password, cpassword });

      //hash password, cpassword

      const userRegister = await user.save();

      if (userRegister) {
        res.status(201).json({ message: "User registered successfully" });
      } else {
        return res.status(500).json({ error: "Failed to register" });
      }
    }
  } catch (error) {
    console.log(`Error: ${error}`);
  }
});

//USING ASYNC AWAIT
router.post("/signin", async (req, res) => {
  try {
    console.log("reached");
    let token;

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ error: "Pls fill all fields.." });
    }

    const userLogin = await User.findOne({ email: email });

    console.log(userLogin); //prints complete document where email matches
    if (userLogin) {
      //compare fn parameters: user entered, database password
      const isMatch = await bcrypt.compare(password, userLogin.password);

      // //token
      // token = await userLogin.generateAuthToken();
      // console.log(token);

      // //store token in a cookie named 'jwtoken' for 30 days i.e. 25892000000 milliseconds
      // res.cookie("jwtoken", token, {
      //   expires: new Date(Date.now() + 25892000000),
      //   httpOnly: true,
      // });

      if (isMatch) {
        //token
        token = await userLogin.generateAuthToken();
        console.log(token);

        //store token in a cookie named 'jwtoken' for 30 days i.e. 25892000000 milliseconds
        res.cookie("jwtoken", token, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: true,
        });
        res.status(201).json({ message: "User signed in successfully" });
      } else {
        //password not match
        return res.status(500).json({ error: "Invalid credentials" });
      }
    } else {
      //email not found in database
      return res.status(500).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});

router.get("/about", authenticate, function (req, res) {
  console.log("I am About.");
  res.send(req.rootUser);
});

//get user data for contact and home page
router.get("/getData", authenticate, function (req, res) {
  console.log("I am Contact.");
  res.send(req.rootUser);
});

//contact us page
router.post("/contact", authenticate, async function (req, res) {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      return res.status(422).json({ error: "Pls fill all fields.." });
    }

    const userContact = await User.findOne({ _id: req.userID });

    if (userContact) {
      const userMessage = await userContact.addMessage(
        name,
        email,
        phone,
        message
      );
      await userContact.save();
      res.status(200).json({ message: "user contact successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/logout", authenticate, function (req, res) {
  console.log("I am About.");
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("User Logout");
});

module.exports = router;
