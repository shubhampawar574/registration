const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  //trim, validate can also be used like type, required
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  work: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  messages: [
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: Number,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
    },
  ],
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

//hashing password
//it acts like a middleware between lines 72 and 77 of auth.js hence 'next'
//it returns promises hence 'async'
// it involves 'this' hence normal fn instead of fat arrow fn
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

//generating token
userSchema.methods.generateAuthToken = async function () {
  try {
    // let jwtoken = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    // this.tokens = this.tokens.concat({ token: jwtoken });
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

//store messages
userSchema.methods.addMessage = async function (name, email, phone, message) {
  try {
    this.messages = this.messages.concat({ name, email, phone, message });
    await this.save();
    return this.messages;
  } catch (err) {
    console.log(err);
  }
};

const User = mongoose.model("users", userSchema);

module.exports = User;
