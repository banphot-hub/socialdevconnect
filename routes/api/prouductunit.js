const express = require("express");
const { check, validationResult } = require("express-validator");
const routes = express.Router();
const config = require("../../config/config");

//@ Load User Models
const Productunit = require("../../models/productunit");
const auth = require("../../middleware/auth");

//  @route      GET /api/v1/productunit
//  @desc       product unit
//  @access     private

routes.get("/", async (req, res) => {
  try {
    const productunit = await Productunit.find();
    res.status(200).json({ success: true, data: productunit });
  } catch (error) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Product unit not found !" });
    }
    res.status(500).send("Inter server error");
  }
});

//  @route      GET /api/v1/productunit/{id}
//  @desc       product unit
//  @access     private

routes.get("/:id", async (req, res) => {
  try {
    const productunit = await Productunit.findById(req.body.id);
    if (!productunit) {
      return res.status(404).json({ msg: "Product unit not found !" });
    }
    restart.status(200).json({ success: true, msg: "Remove success" });
  } catch (error) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Product unit not found !" });
    }
    res.status(500).send("Inter server error");
  }
});

//  @route      delete /api/v1/productunit
//  @desc       product unit
//  @access     private

routes.delete("/:id", async (req, res) => {
  try {
    const productunit = await Productunit.findOneAndRemove(req.params.id);
    if (!productunit) {
      return res.status(404).jsoin({ msg: "Delete fail!" });
    }
    res.status(200).json({ success: true, msg: "Remove success!" });
  } catch (error) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Product unit not found !" });
    }
    res.status(500).send("Inter server error");
  }
});

//  @route      POST /api/v1/productunit
//  @desc       product unit
//  @access     private

routes.post("/", async (req, res) => {
  try {
    const productunit = await Productunit.create(req.body);
    res.json({ success: true, data: productunit });
  } catch (error) {
    if (err.kind === "ObjectId") {
      return res.status(404).jsoin({ msg: "Product unit not found !" });
    }
    res.status(500).send("Inter server error");
  }
});

//  @route      PUT /api/v1/productunit
//  @desc       Update product unit
//  @access     private

routes.put("/:id", async (req, res) => {
  try {
    const productunit = await Productunit.findById(req.params.id);
    if (!productunit) {
      return res.status(400).json({ msg: "product unit not found" });
    }
    const result = await Productunit.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    if (err.kind === "ObjectId") {
      return res.status(404).jsoin({ msg: "Product unit not found !" });
    }
    res.status(500).send("Inter server error");
  }
});

module.exports = routes;
