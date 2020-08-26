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
      let profile = await Profile.findOne({user: req.user.id});
   
      if(profile){
        //update 
         profile = await Profile.findOneAndUpdate({ user: req.body.id },{ $set: profileFields },{ new: true });
         return res.json(profile);
      }
     //Create profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
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
routes.get('/', async (req,res)=>{
  try {
    const profiles = await Profile.find().populate('user',['name','avatar']);
    res.json(profiles);

  }catch(err){
    console.error(err.message);
    res.status(500).send('Server error');
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
routes.get('/user/:user_id', async (req,res)=>{
  try {
    console.log(req.params.user_id);
    const profiles = await Profile.findOne({user: req.params.user_id}).populate('user',['name','avatar']);
    if(!profiles) {
      return res.status(400).json({messsage: 'There is no profile for this user'});
    }
    res.json(profiles);

  }catch(err){
    console.error(err.message);
    res.status(500).send('Internal server error');
  }
});

routes.delete('/',auth,(req,res)=>{
  
});

module.exports = routes;
