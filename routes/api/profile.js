// @=================================================================================================================================
// @Create by       Banphot Khongpom
// @Desc            Profile enpoint
// @access          Private
// @Create date     25/08/2020
// @=================================================================================================================================

const express = require("express");
const routes = express.Router();
const { check, validationResult } = require("express-validator");
const authen = require("../../middleware/auth");
// Load Profile model and user model
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const auth = require("../../middleware/auth");

// @route       GET /api/v1/profile/me
// @desc        Get current user profiles
// @access      Private
/**
 * @swagger
 * /api/v1/profile/me:
 *   get:
 *     tags:
 *       - Profile
 *     summary: "Get user profile"
 *     security:
 *       - x-auth-token: []
 *     description: Get users profile information with token validations
 *     parameters:
 *       - name: x-auth-token
 *         description: Credentials token keys
 *         in: header
 *         type: string
 *         required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success to validate token
 *       400:
 *          description: 'There is no profile for this user'
 *       401:
 *          description: 'Unauthorized'
 *       500:
 *          description: 'Server error'
 *
 */
routes.get("/me", authen, async (req, res) => {
  try {
    // Find out profile collection with user id from req authen and populate only field user, name and avatar
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("users", ["name", "avatar"]);
    // check found profile from user authen or not ?
    if (!profile) {
      res.status(400).json({ message: "There is no profile for this user" });
    }
    // rest profile data
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route       POST /api/v1/profile
// @desc        Create or update for user profiles
// @access      Private

routes.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;
    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    //skill have a array in mongo collection
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    //Bulid social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    console.log(profileFields.skills);
    res.send("hello world");
  }
);

module.exports = routes;
