const express = require("express");
const { check, validationResult } = require("express-validator");
const routes = express.Router();
const config = require("../../config/config");

//@ Load User Models
const Product = require("../../models/Products");
const auth = require("../../middleware/auth");

//  @route      GET /api/v1/supplier
//  @desc       supplier
//  @access     private

routes.get("/", async (req, res) => {
  try {
    const product = await Product.find();
    if (!product) {
      res.status(400).json({ msg: "Productg not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ msg: "Product not found" });
    }
    res.status(500).send("Internal Server error");
  }
});

//  @route      GET /api/v1/supplier/{id}
//  @desc       supplier
//  @access     private

routes.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(400).json({ msg: "Productg not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ msg: "Product not found" });
    }
    res.status(500).send("Internal Server error");
  }
});

//  @route      POST /api/v1/supplier/{id}
//  @desc       Create products
//  @access     private

routes.post("/", async (req, res) => {
  try {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res.status(400).send("Object missing");
    }
    const product = await Product.create(req.body);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ msg: "Product not found" });
    }
    res.status(500).send("Internal Server error");
  }
});

//  @route      put /api/v1/supplier/{id}
//  @desc       Create products
//  @access     private

routes.put("/:id", async (req, res) => {
  try {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res.status(400).send("Object missing");
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(400).json({ msg: "Product not found" });
    }
    await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, msg: "Update has successfully" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ msg: "Product not found" });
    }
    res.status(500).send("Internal Server error");
  }
});

//  @route      delete /api/v1/supplier/{id}
//  @desc       Create products
//  @access     private

routes.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(400).json({ msg: "Product not found" });
    }
    await Product.findByIdAndRemove(req.params.id);
    res
      .status(200)
      .json({ success: true, msg: "Remove product has successfully" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ msg: "Product not found" });
    }
    res.status(500).send("Internal Server error");
  }
});

module.exports = routes;
