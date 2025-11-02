"use strict";
require("dotenv").config();

const path = require("path");
const express = require("express");
const app = express();

const jokeRoutes = require("./routes/jokebook.routes");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/jokebook", jokeRoutes);

// health
app.get("/health", (_req, res) => res.json({ ok: true }));

// 404
app.use((req, res) => res.status(404).json({ error: "Not Found" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Jokebook running on http://localhost:${PORT}`);
});