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
const { restart } = require("nodemon");

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
    }).populate("user", ["name", "avatar"]);
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
/**
 * @swagger
 * definitions:
 *   Profile:
 *     properties:
 *       company:
 *         type: string
 *       website:
 *         type: string
 *       location:
 *         type: string
 *       bio:
 *         type: string
 *       status:
 *         type: string
 *       githubusername:
 *         type: string
 *       skills:
 *         type: array
 *         items:
 *          oneOf:
 *           - type: string
 *       youtube:
 *         type: string
 *       facebook:
 *         type: string
 *       twitter:
 *         type: string
 *       instagram:
 *         type: string
 *       linkedin:
 *         type: string
 *
 */
/**
/**
 * @swagger
 * /api/v1/profile:
 *   post:
 *     tags:
 *       - Profile
 *     summary: "Create user profile"
 *     security:
 *       - x-auth-token: []
 *     description: Create or update user profiles.
 *     parameters:
 *       - name: x-auth-token
 *         description: Credentials token keys
 *         in: header
 *         type: string
 *         required: true
 *       - name: create-user-profile
 *         description: Create or update user profile
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Profile'
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully created
 *       400:
 *         description: Please check token or api validaation.
 *       500:
 *         description: Server error may problem from in code of API
 */
routes.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
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

    try {
      // Check user profile from auth rout data because after pass route authen system send user information on it
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.body.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      //Create profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route       GET /api/v1/profile
// @desc        Get all profile user
// @access      Private

/**
 * @swagger
 * /api/v1/profile:
 *   get:
 *     tags:
 *        - Users
 *     summary: "Get all user profile"
 *     description: Get all user profile
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success to validate token
 *       500:
 *          description: 'Server error'
 *
 */
routes.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route       GET /api/v1/profile/user/:user_id
// @desc        Get profile by user id
// @access      Public
/**
 * @swagger
 * paths:
 *   /api/v1/profile/user/{user_id}:
 *     get:
 *      tags:
 *        - Users
 *      summary: Get user profile by user id
 *      description: Get user profile by user id
 *      parameters:
 *         - in: path
 *           name: user_id
 *           type: string
 *           description: Plese enter user id
 *      produces:
 *         - application/json
 *      responses:
 *         200:
 *             description: Success to validate token
 *         500:
 *             description: 'Server error'
 *
 */
routes.get("/user/:user_id", async (req, res) => {
  try {
    console.log(req.params.user_id);
    const profiles = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profiles) {
      return res
        .status(400)
        .json({ messsage: "There is no profile for this user" });
    }
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal server error");
  }
});

// @route       DELETE /api/v1/profile
// @desc        Delete Profile, User and Post
// @access      Private
/**
 * @swagger
 *   /api/v1/profile:
 *     delete:
 *      tags:
 *        - Profile
 *      summary: Delete user and profile, post and comment
 *      security:
 *         - x-auth-token: []
 *      description:  Delete user and profile, post and comment
 *      parameters:
 *         - in: header
 *           name: x-auth-token
 *           type: string
 *           description: Please enter token key
 *      produces:
 *         - application/json
 *      responses:
 *         200:
 *             description: Success to validate token
 *         401:
 *             description: Unauthorize
 *         500:
 *             description: 'Server error'
 *
 */
routes.delete("/", auth, async (req, res) => {
  // @todo Remove user profile
  // Remove profile
  await Profile.findOneAndRemove({ user: req.user.id });
  // Remove user
  await User.findOneAndRemove({ _id: req.user.id });

  res.json({ message: "User deleted" });
});

// @route       PUT /api/v1/profile/experience
// @desc        Add profile experience
// @access      Private

/**
 * @swagger
 * definitions:
 *   Experience:
 *     properties:
 *       title:
 *         type: string
 *       company:
 *         type: string
 *       location:
 *         type: string
 *       from:
 *         type: string
 *       to:
 *         type: string
 *       current:
 *         type: boolean
 *       description:
 *         type: string
 *
 */
/**
/**
 * @swagger
 * /api/v1/profile/experience:
 *   put:
 *     tags:
 *       - Profile
 *     summary: "Add profile experience"
 *     security:
 *       - x-auth-token: []
 *     description: Add profile experience.
 *     parameters:
 *       - name: x-auth-token
 *         description: Credentials token keys
 *         in: header
 *         type: string
 *         required: true
 *       - name: add-profile-experience
 *         description: Add profile experience
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Experience'
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully created
 *       400:
 *         description: Please check token or api validaation.
 *       500:
 *         description: Server error may problem from in code of API
 */
routes.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "The company is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // to assign value from req.body
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    const newExperience = {
      title: title,
      company: company,
      location: location,
      from: from,
      to: to,
      current: current,
      description: description,
    };

    try {
      // Find profile from user
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        res.status(400).send("Not found user profile");
      }
      profile.experience.unshift(newExperience);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal server error");
    }
  }
);

// @route       DELETE /api/v1/profile/experience/:exp_id
// @desc        Delete experience from profiles
// @access      Private
/**
 * @swagger
 * paths:
 *   /api/v1/profile/experience/{exp_id}:
 *     delete:
 *      tags:
 *        - Profile
 *      summary: Delete profile experiences
 *      security:
 *         - x-auth-token: []
 *      description: Delete profile experiences
 *      parameters:
 *         - in: path
 *           name: exp_id
 *           type: string
 *           description: Plese enter user id
 *         - name: x-auth-token
 *           description: Credentials token keys
 *           in: header
 *           type: string
 *           required: true
 *      produces:
 *         - application/json
 *      responses:
 *         200:
 *             description: Success to validate token
 *         500:
 *             description: 'Server error'
 *
 */

routes.delete("/experience/:exp_id", auth, async (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then((profile) => {
      // Get remove index
      const removeIndex = profile.experience
        .map((item) => item.id)
        .indexOf(req.params.exp_id);

      // Splice out of array
      profile.experience.splice(removeIndex, 1);

      // Save
      profile.save().then((profile) => res.json(profile));
    })
    .catch((err) => res.status(404).json(err));
});

module.exports = routes;
