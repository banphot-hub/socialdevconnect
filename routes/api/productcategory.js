// @=================================================================================================================================
// @Create by       Banphot Khongpom
// @Desc            User enpoint
// @access          Private
// @Create date     25/08/2020
// @=================================================================================================================================

const path = require("path");
const express = require("express");
const { check, validationResult } = require("express-validator");
const routes = express.Router();
const config = require("../../config/config");

//@ Load User Models
const Productcategory = require("../../models/productCategory");
const auth = require("../../middleware/auth");

//  @route      POST /api/v1/productcategory
//  @desc       Register product category
//  @access     public

/**
 * @swagger
 * definitions:
 *   productcategory:
 *     properties:
 *       categoryname:
 *         type: string
 *       categorydescription:
 *         type: string
 *       categoryimage:
 *         type: string
 *
 */
/**
/**
 * @swagger
 * /api/v1/productcategory:
 *   post:
 *     tags:
 *       - Productcategory
 *     summary: "Product category register"
 *     security:
 *       - x-auth-token: []
 *     description: Product category register
 *         - application/json
 *     parameters:
 *       - name: x-auth-token
 *         in: header
 *         type: string
 *         required: true
 *         description: Credentials token keys 
 *       - name: productcategory-register
 *         description: product category register
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/productcategory'
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
  //[auth, [check("categoryname", "Name is required").not().isEmpty()]],
  [check("categoryname", "Name is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    // Load data from req.body
    const { categoryname, categorydescription, categoryimage } = req.body;
    try {
      // @Check user exist on system with email
      let productcategory = await Productcategory.findOne({ categoryname });
      if (productcategory) {
        res
          .status(400)
          .json({ errors: [{ msg: "categoryname already exists" }] });
      }

      const newProductCategory = new Productcategory({
        categoryname,
        categorydescription,
        categoryimage,
      });

      await newProductCategory.save();
      res.json({ success: true, data: newProductCategory });
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
 * /api/v1/productcategory/{id}:
 *   get:
 *     tags:
 *        - Productcategory
 *     security:
 *        - x-auth-token: []
 *     description: Get post by Id
 *     parameters:
 *        - name: x-auth-token
 *          in: header
 *          type: string
 *          required: true
 *          description: Credentials token keys
 *        - in: path
 *          name: id
 *          type: string
 *          description: Plese enter post id
 *     produces:
 *        - application/json
 *     responses:
 *        200:
 *            description: Success to validate token
 *        500:
 *            description: 'Server error'
 *
 *
 */
routes.get("/:id", async (req, res) => {
  try {
    const productcategory = await Productcategory.findById(req.params.id);
    res.status(200).json({ success: true, data: productcategory });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route       GET /api/v1/profile
// @desc        Get all profile user
// @access      Private

/**
 * @swagger
 * /api/v1/productcategory:
 *   get:
 *     tags:
 *        - Productcategory
 *     summary: "Get all Productcategory profile"
 *     description: Get all Productcategory profile
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
    const productcategory = await Productcategory.find();
    res.status(200).json({ success: true, data: productcategory });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route       delete /api/v1/productcategory/{id}
// @desc        delete product category by id
// @access      Private

routes.delete("/:id", async (req, res) => {
  try {
    const productcategory = await Productcategory.findById(req.params.id);
    if (!productcategory) {
      return res.status(404).json({ message: "Product category not found" });
    }
    productcategory.remove();
    res.json({ message: "Product category has remove" });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).jsoin({ msg: "Product category not found" });
    }
    res.status(500).send("Inter server error");
  }
});

// @route       put /api/v1/productcategory/{id}
// @desc        put product category by id
// @access      Private

routes.put("/:id", async (req, res) => {
  try {
    const productcategory = await Productcategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!productcategory) {
      return res.status(200).jsoin({ success: true, data: "not success" });
    }
    res.status(200).json({ success: true, data: productcategory });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).jsoin({ msg: "Product category not found" });
    }
    res.status(400).send("Inter server errorss");
  }
});

// @route       put /api/v1/productcategory/{id}/photo
// @desc        upload  impage product category by id
// @access      Private

/**
 * @swagger
 * definitions:
 *   Education:
 *     properties:
 *       school:
 *         type: string
 *       degree:
 *         type: string
 *       fieldofstudy:
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
 * /api/v1/productcategory/{id}/photo:
 *   put:
 *     tags:
 *       - Productcategory
 *     summary: "Uplod image to Productcategory"
 *     security:
 *       - x-auth-token: []
 *     description: Upload image to productcategory.
 *     parameters:
 *       - name: x-auth-token
 *         description: Credentials token keys
 *         in: header
 *         type: string
 *         required: true
 *       - name: upload-image
 *         description: Upload image to productcategory
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Education'
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

routes.put("/:id/photo", async (req, res) => {
  try {
    const productcategory = await Productcategory.findById(req.params.id);
    // check found this product category or not !
    if (!productcategory) {
      return res.status(404).json({ message: "Product category not found!" });
    }
    // check have file upload or not
    if (!req.files) {
      return res.status(404).json({ message: "Please upload files" });
    }
    // check file type is images
    const file = req.files.file;
    if (!file.mimetype.startsWith("image")) {
      return res.status(400).json({ message: "Please upload image file..." });
    }
    // Check file upload over max file upload
    if (file.size > config.max_file_upload) {
      return res.status(400).json({
        message: `Please upload file less than ${config.max_file_upload}`,
      });
    }
    // defind file and extention with path
    file.name = `photo_category_${productcategory._id}${
      path.parse(file.name).ext
    }`;
    //Mov file to local path
    file.mv(`${config.file_upload_path}/${file.name}`, async (err) => {
      // check move file error or not
      if (err) {
        return res.status(500).json({
          message: `Promblem file upload}`,
        });
      }
      const result = await Productcategory.findByIdAndUpdate(req.params.id, {
        categoryimage: file.name,
      });
      res.status(200).json({ success: true, data: result });
    });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).jsoin({ msg: "Product category not found" });
    }
    res.status(500).send("Inter server error");
  }
});

module.exports = routes;
