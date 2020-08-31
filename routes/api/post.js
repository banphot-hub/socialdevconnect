// @=================================================================================================================================
// @Create by       Banphot Khongpom
// @Desc            POST enpoint
// @access          Private
// @Create date     27/08/2020
// @=================================================================================================================================

const express = require("express");
const routes = express.Router();
const { check, validationResult } = require("express-validator");

// Load Profile model and user model
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");
const User = require("../../models/User");
const auth = require("../../middleware/auth");

/**
 * @swagger
 * definitions:
 *   Post:
 *     properties:
 *       text:
 *         type: string
 *
 */
/**

/**
 * @swagger
 * /api/v1/post:
 *   post:
 *     tags:
 *       - Post
 *     summary: "Create post"
 *     security:
 *       - x-auth-token: []
 *     description: Create post
 *     parameters:
 *       - name: x-auth-token
 *         description: Credentials token keys
 *         in: header
 *         type: string
 *         required: true
 *       - name: create-user-post
 *         description: Create post
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Post'
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
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // find User from user authen
    const users = await User.findById(req.user.id).select("-password");
    console.log(req.user.id);
    try {
      const newPost = new Post({
        text: req.body.text,
        name: users.name,
        avatar: users.avatar,
        user: req.user.id,
      });
      newPost.save();
      res.json({ success: true, data: newPost });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal server errors");
    }
  }
);

// @route       GET /api/v1/post/:{id}
// @desc        Get post by id
// @access      Private
/**
 * @swagger
 * paths:
 *   /api/v1/post/{id}:
 *     get:
 *      tags:
 *        - Post
 *      summary: Get post by id
 *      security:
 *        - x-auth-token: []
 *      description: Get post by Id
 *      parameters:
 *         - name: x-auth-token
 *           in: header
 *           type: string
 *           required: true
 *           description: Credentials token keys
 *         - in: path
 *           name: id
 *           type: string
 *           description: Plese enter post id
 *      produces:
 *         - application/json
 *      responses:
 *         200:
 *             description: Success to validate token
 *         500:
 *             description: 'Server error'
 *
 */
routes.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).sort({ date: -1 });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "Objectid") {
      return res.status(404).jsoin({ msg: "Post not found" });
    }
    res.status(500).send("Inter server error");
  }
});

// @route       DELETE /api/v1/post/:{id}
// @desc        Delete post by id
// @access      Private
/**
 * @swagger
 * paths:
 *   /api/v1/post/{id}:
 *     delete:
 *      tags:
 *        - Post
 *      summary: Delete post by id
 *      security:
 *        - x-auth-token: []
 *      description: Delete post by Id
 *      parameters:
 *         - name: x-auth-token
 *           in: header
 *           type: string
 *           required: true
 *           description: Credentials token keys
 *         - in: path
 *           name: id
 *           type: string
 *           description: Plese enter post id
 *      produces:
 *         - application/json
 *      responses:
 *         200:
 *             description: Success to validate token
 *         500:
 *             description: 'Server error'
 *
 */
routes.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }
    post.remove();
    res.json({ message: "Post remove" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).jsoin({ msg: "Post not found" });
    }
    res.status(500).send("Inter server error");
  }
});

// @route       PUT /api/v1/post/like/:{id}
// @desc        PUT post by id
// @access      Private
/**
 * @swagger
 * paths:
 *   /api/v1/post/like/{id}:
 *     put:
 *      tags:
 *        - Post
 *      summary: Liked post by post id
 *      security:
 *        - x-auth-token: []
 *      description: Liked post by post Id
 *      parameters:
 *         - name: x-auth-token
 *           in: header
 *           type: string
 *           required: true
 *           description: Credentials token keys
 *         - in: path
 *           name: id
 *           type: string
 *           description: Liked enter post by post id
 *      produces:
 *         - application/json
 *      responses:
 *         200:
 *             description: Success to validate token
 *         500:
 *             description: 'Server error'
 *
 */

routes.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // Check user already has been liked that post.
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(404).json({ message: "Your already liked this !" });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "post not found" });
    }
    res.status(500).send("Internal server error");
  }
});

// @route       PUT /api/v1/post/unlike/:{id}
// @desc        PUT Unlike post by post id
// @access      Private
/**
 * @swagger
 * paths:
 *   /api/v1/post/unlike/{id}:
 *     put:
 *      tags:
 *        - Post
 *      summary: Unlike post by post id
 *      security:
 *        - x-auth-token: []
 *      description: Unlike post by post Id
 *      parameters:
 *         - name: x-auth-token
 *           in: header
 *           type: string
 *           required: true
 *           description: Credentials token keys
 *         - in: path
 *           name: id
 *           type: string
 *           description: Unlike enter post by post id
 *      produces:
 *         - application/json
 *      responses:
 *         200:
 *             description: Success to validate token
 *         500:
 *             description: 'Server error'
 *
 */

routes.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // Check user already has been liked that post.
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(404).json({ message: "Post has not yet been liked" });
    }
    // get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);
    post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "post not found" });
    }
    res.status(500).send("Internal server error");
  }
});


/**
 * @swagger
 * definitions:
 *   Post:
 *     properties:
 *       text:
 *         type: string
 *
 */
/**

/**
 * @swagger
 * paths:
 *   /api/v1/post/comment/{id}:
 *     post:
 *      tags:
 *        - Post
 *      summary: Add post comment by post id
 *      security:
 *        - x-auth-token: []
 *      description: Add post comment by post id
 *      parameters:
 *         - name: x-auth-token
 *           in: header
 *           type: string
 *           required: true
 *           description: Credentials token keys
 *         - in: path
 *           name: id
 *           type: string
 *         - name: create-post-comment
 *           description: Add post comment by post id
 *           in: body
 *           required: true
 *           schema:
 *             $ref: '#/definitions/Post'   
 *            
 *      produces:
 *         - application/json
 *      responses:
 *         200:
 *             description: Success to validate token
 *         500:
 *             description: 'Server error'
 *
 */

routes.post(
    "/comment/:id",
    [auth, [check("text", "Text is required").not().isEmpty()]],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // find User from user authen
      const users = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);
      console.log(req.user.id);
      try {
        const newComment = {
          text: req.body.text,
          name: users.name,
          avatar: users.avatar,
          user: req.user.id,
        }

        post.comment.unshift(newComment);

        await post.save()

        res.json({ success: true, data: post.comment });
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal server errors");
      }
    }
  );


  /**
 * @swagger
 * paths:
 *   /api/v1/post/comment/{id}/{commentId}:
 *     delete:
 *      tags:
 *        - Post
 *      summary: Add post comment by post id
 *      security:
 *        - x-auth-token: []
 *      description: Add post comment by post id
 *      parameters:
 *         - name: x-auth-token
 *           in: header
 *           type: string
 *           required: true
 *           description: Credentials token keys
 *         - in: path
 *           name: id
 *           type: string
 *           name: commentId
 *           type: string
 *      produces:
 *         - application/json
 *      responses:
 *         200:
 *             description: Success to validate token
 *         500:
 *             description: 'Server error'
 *
 */

  routes.delete('/comment/:id/:comment_id',auth, async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        // Pull out comment
        const comment =  post.comment.find(comment => comment.id === req.params.comment_id);
        // Make sure comment exists
        if(!comment){
            return res.status(404).json({message: 'Comment does not exist'});
        }
        // Check user
        if(comment.user.toString() !== req.user.id){
            return res.status(404).json({message: 'User not authorized'});
        }
        // Get removeIndex
        const removeIndex = post.comment.map(comment=> comment.user.toString()).indexOf(req.user.id);
        post.comment.splice(removeIndex,1);

        await post.save();
        res.json(post.comment);

    } catch(err){
        console.error(err.message);
        res.status(500).send('Internal server error');
    }
  });

module.exports = routes;
