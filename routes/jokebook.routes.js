"use strict";

const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/jokebook.controller");

// order matters: static paths before param paths
router.get("/categories", ctrl.getCategories);
router.get("/category/:category", ctrl.getByCategory);
router.get("/random", ctrl.getRandom);
router.post("/joke/add", ctrl.addJoke);



router.get("/all", async (req, res) => {
    try {
      const { rows } = await require("../models/db").query(
        "SELECT * FROM jokes ORDER BY id ASC;"
      );
      res.json(rows);
    } catch (err) {
      console.error("getAll error:", err);
      res.status(500).json({ error: "Failed to fetch all jokes" });
    }
  });

 module.exports = router;