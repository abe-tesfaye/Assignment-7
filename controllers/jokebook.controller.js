"use strict";

const model = require("../models/jokebook.model");

async function getCategories(_req, res) {
  try {
    const categories = await model.getAllCategories();
    res.json(categories);
  } catch (err) {
    console.error("getCategories:", err);
    res.status(500).json({ error: "Server error fetching categories" });
  }
}

async function getByCategory(req, res) {
  try {
    const category = String(req.params.category || "").trim();
    const limitParam = req.query.limit;
    const limit = limitParam !== undefined ? parseInt(limitParam, 10) : undefined;

    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }
    if (limit !== undefined && (!Number.isInteger(limit) || limit <= 0)) {
      return res.status(400).json({ error: "limit must be a positive integer" });
    }

    const jokes = await model.getJokesByCategory(category, limit);
    res.json(jokes);
  } catch (err) {
    console.error("getByCategory:", err);
    res.status(500).json({ error: "Server error fetching jokes" });
  }
}

async function getRandom(_req, res) {
  try {
    const joke = await model.getRandomJoke();
    if (!joke) return res.status(404).json({ error: "No jokes found" });
    res.json(joke);
  } catch (err) {
    console.error("getRandom:", err);
    res.status(500).json({ error: "Server error fetching random joke" });
  }
}

async function addJoke(req, res) {
  try {
    let { category, setup, delivery } = req.body || {};
    if (!category || !setup || !delivery) {
      return res.status(400).json({ error: "category, setup, and delivery are required" });
    }
    category = String(category).trim();
    setup = String(setup).trim();
    delivery = String(delivery).trim();

    const joke = await model.addJoke({ category, setup, delivery });
    res.status(201).json(joke);
  } catch (err) {
    console.error("addJoke:", err);
    res.status(500).json({ error: "Server error adding joke" });
  }
}

module.exports = {
  getCategories,
  getByCategory,
  getRandom,
  addJoke
};