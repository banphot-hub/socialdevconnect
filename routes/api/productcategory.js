// @=================================================================================================================================
// @Create by       Banphot Khongpom
// @Desc            User enpoint
// @access          Private
// @Create date     25/08/2020
// @=================================================================================================================================

const express = require("express");
const { check, validationResult } = require("express-validator");
const routes = express.Router();

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
 *     description: Product category register
 *     produces:
 *       - application/json
 *     parameters:
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
  [auth, [check("categoryname", "Name is required").not().isEmpty()]],
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

module.exports = routes;
