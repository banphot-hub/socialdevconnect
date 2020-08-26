// @=================================================================================================================================
// @Create by       Banphot Khongpom
// @Desc            User enpoint
// @access          Private
// @Create date     25/08/2020
// @=================================================================================================================================

const express = require("express");
const { check, validationResult } = require("express-validator");
const routes = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//@ Load User Models
const User = require("../../models/User");
const config = require("../../config/config");

//  @route      POST /api/v1/users
//  @desc       Register user
//  @access     public

/**
 * @swagger
 * definitions:
 *   users:
 *     properties:
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *
 */
/**
/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: "User register"
 *     description: User registrtion to system
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user-register
 *         description: User registration
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/users'
 *     responses:
 *       200:
 *         description: Successfully created
 *       400:
 *         description: Problem may can't pass validation let your check data befor send to system
 *       500: 
 *         description: Internal server error please contract admin or your has not yet to correct using resource
 */
routes.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include is valid email").isEmail(),
    check(
      "password",
      "Pease enter a password with 6 more charachter"
    ).isLength({ min: 6 }),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    // Load data from req.body
    const { name, email, password } = req.body;
    try {
      // @Check user exist on system with email
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ errors: [{ msg: "User already exists" }] });
      }
      // @Get user Gravatra
      // Load email for get avatar from email with gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      const newUser = new User({
        name,
        email,
        avatar,
        password,
      });
      // @Encrypt password
      // to encrypt with salt and hash password field and save to User documents in mongodb
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(password, salt);
      await newUser.save();

      // @return jsonwebtoken
      const playload = {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          avatar: newUser.avatar
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
