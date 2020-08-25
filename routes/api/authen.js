// @=================================================================================================================================
// @Create by       Banphot Khongpom
// @Desc            authen enpoint
// @access          Private
// @Create date     25/08/2020
// @=================================================================================================================================

const express = require("express");
const routes = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//@ Load User Models
const Users = require("../../models/User");
const config = require("../../config/config");

// @route   GET /api/v1/authen
// @desc    test route authentication
// @access  Private

routes.get("/", auth, async (req, res) => {
  try {
    console.log(req.user.id);
    const user = await await Users.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.err(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST /api/v1/authen
// @desc    user login and generate token
// @access  Private

routes.post(
  "/",
  [
    check("email", "Please include is valid email").isEmail(),
    check("password", "Password is requied").exists(),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    // Load data from req.body
    const { email, password } = req.body;
    try {
      // @Check user exist on system with email
      let user = await Users.findOne({ email });
      if (!user) {
        res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials email not found" }] });
      }
      // Compare password
      const isMatch = bcrypt.compareSync(password, user.password);
      console.log(isMatch);
      console.log(user.password);
      if (!isMatch) {
        return res.status(400).json({
          errors: [{ msg: "Invalid Credentials password not match" }],
        });
      }
      // @return jsonwebtoken
      const playload = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
      jwt.sign(
        playload,
        config.secretOrKey,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = routes;
