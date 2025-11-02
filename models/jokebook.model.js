"use strict";

const db = require("./db");

async function getAllCategories() {
  const sql = "SELECT DISTINCT category FROM jokes ORDER BY category ASC;";
  const { rows } = await db.query(sql);
  return rows.map(r => r.category);
}

async function getJokesByCategory(category, limit) {
  let sql = "SELECT id, category, setup, delivery FROM jokes WHERE category = $1";
  const params = [category];

  if (Number.isInteger(limit) && limit > 0) {
    sql += " LIMIT $2";
    params.push(limit);
  }

  const { rows } = await db.query(sql, params);
  return rows;
}

async function getRandomJoke() {
  const sql = "SELECT id, category, setup, delivery FROM jokes ORDER BY RANDOM() LIMIT 1;";
  const { rows } = await db.query(sql);
  return rows[0] || null;
}

async function addJoke({ category, setup, delivery }) {
  const sql = `
    INSERT INTO jokes (category, setup, delivery)
    VALUES ($1, $2, $3)
    RETURNING id, category, setup, delivery;
  `;
  const params = [category, setup, delivery];
  const { rows } = await db.query(sql, params);
  return rows[0];
}

module.exports = {
  getAllCategories,
  getJokesByCategory,
  getRandomJoke,
  addJoke
};