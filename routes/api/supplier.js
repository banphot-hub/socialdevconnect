const express = require("express");
const { check, validationResult } = require("express-validator");
const routes = express.Router();
const config = require("../../config/config");

//@ Load User Models
const Supplier = require("../../models/supplier");
const auth = require("../../middleware/auth");

//  @route      GET /api/v1/supplier
//  @desc       supplier
//  @access     private

routes.get("/", async (req, res) => {
  try {
    const supplier = await Supplier.find();
    if (!supplier) {
      return res.status(400).json({ msg: "Not found data!" });
    }
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    if (err.kind === "ObjectId") {
      return res.status(404).jsoin({ msg: "Supplier not found" });
    }
    res.status(500).send("Inter server error");
  }
});

//  @route      GET /api/v1/supplier/{id}
//  @desc       get supplier by id
//  @access     private

routes.get("/:id", async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(400).json({ msg: "Suppiler not found by id!" });
    }
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Supplier not found" });
    }
    res.status(500).send("Internal server error");
  }
});

//  @route      POST /api/v1/supplier/{id}
//  @desc       Create supplier by id
//  @access     private

routes.post("/", async (req, res) => {
  try {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res.status(400).send("Object missing");
    }
    const supplier = await Supplier.create(req.body);
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ msg: "Supplier not found" });
    }
    res.status(500).send("Internal server error");
  }
});

//  @route      put /api/v1/supplier/{id}
//  @desc       update supplier by id
//  @access     private

routes.put("/:id", async (req, res) => {
  try {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res.status(400).send("Object missing");
    }

    await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ msg: "Supplier update success" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ msg: "Supplier not found!" });
    }
    res.status(500).send("Internal Server Error");
  }
});

//  @route      delete /api/v1/supplier/{id}
//  @desc       delete supplier by id
//  @access     private
routes.delete("/:id", async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(400).json({ msg: "Supplier not found" });
    }
    await Supplier.findByIdAndRemove(req.params.id);
    res.status(200).json({ msg: "Remove supplier has success!" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ msg: "Supplier not found" });
    }
    res.status(500).send("Internal Server Error");
  }
});

module.exports = routes;
