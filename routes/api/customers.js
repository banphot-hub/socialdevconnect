const express = require("express");
const { check, validationResult } = require("express-validator");
const routes = express.Router();
const config = require("../../config/config");

//@ Load User Models
const Customers = require("../../models/customers");
const auth = require("../../middleware/auth");

//  @route      GET /api/v1/customers
//  @desc       customer
//  @access     private

routes.get("/", async (req, res) => {
  try {
    const customers = await Customers.find();
    res.status(200).json({ success: true, data: customers });
  } catch (error) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Customer not found !" });
    }
    res.status(500).send("Inter server error");
  }
});

//  @route      GET /api/v1/customers/{id}
//  @desc       Get customers by id
//  @access     private

routes.get("/:id", async (req, res) => {
  try {
    const customer = await Customers.findById(req.params.id);
    if (!customer) {
      return res.status(400).json({ msg: "Customer not found !" });
    }
    res.status(200).json({ success: true, data: customer });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Customer not found !" });
    }
    res.status(500).send("Inter server error");
  }
});

//  @route      POST /api/v1/customers
//  @desc       Add customer
//  @access     private

routes.post(
  "/",
  [check("custname", "custname is required").not().isEmpty()],
  async (req, res) => {
    try {
      // validate from model
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const customer = await Customers.create(req.body);
      if (!customer) {
        return res.status(400).json({ msg: "Crate fail !" });
      }
      res.status(200).json({ success: true, data: customer });
    } catch (error) {
      if (error.kind === "ObjectId") {
        return res.status(404).json({ msg: "Customer not found !" });
      }
      res.status(500).send("Inter server error");
    }
  }
);

//  @route      PUT /api/v1/customers
//  @desc       Update customer
//  @access     private

routes.put("/:id", async (req, res) => {
  try {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res.status(400).json({ msg: "No data to update" });
    }

    await Customers.findByIdAndUpdate(req.params.id, req.body, {
      now: true,
      runValidators: true,
    });
    res.status(200).json({ success: true });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Customer not found !" });
    }
    res.status(500).send("Inter server error");
  }
});

//  @route      delete /api/v1/customers
//  @desc       delete customer
//  @access     private

routes.delete("/:id", async (req, res) => {
  try {
    const customer = await Customers.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ msg: "Customer not found !" });
    }
    await Customers.findByIdAndRemove(req.params.id);
    res.status(200).json({ success: true, msg: "Remove has success" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Customer not found !" });
    }
    res.status(500).send("Inter server error");
  }
});

module.exports = routes;
