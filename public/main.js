"use strict";

const API_BASE = "/jokebook";
let selectedCategory = null;

window.addEventListener("load", () => {
  wireEvents();
  loadRandom();
  loadCategories();
});

function wireEvents() {
  q("#btn-random").addEventListener("click", loadRandom);
  q("#btn-load").addEventListener("click", () => {
    if (!selectedCategory) return toast("Pick a category first.");
    loadByCategory(selectedCategory, getLimit());
  });

  // ✅ Auto-lowercase category before sending
  q("#add-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = Object.fromEntries(fd.entries());

    // --- Convert category to lowercase to prevent duplicates like Dad/dad
    body.category = body.category.trim().toLowerCase();
    body.setup = body.setup.trim();
    body.delivery = body.delivery.trim();

    try {
      const res = await fetch(`${API_BASE}/joke/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Add failed (${res.status})`);
      const data = await res.json();
      toast("Joke added!");
      e.target.reset();

      // ✅ Reload category jokes if relevant
      if (selectedCategory && data.category === selectedCategory) {
        loadByCategory(selectedCategory, getLimit());
      }
    } catch (err) {
      console.error(err);
      toast("Could not add joke.");
    }
  });
}

/* ---------- Loaders ---------- */

async function loadRandom() {
  try {
    const joke = await jget("/random");
    renderRandom(joke);
  } catch (err) {
    console.error(err);
    q("#random-joke").textContent = "Could not fetch a random joke.";
  }
}

async function loadCategories() {
  try {
    const cats = await jget("/categories");
    renderCategories(cats);
  } catch (err) {
    console.error(err);
    q("#category-list").textContent = "Could not load categories.";
  }
}

async function loadByCategory(category, limit) {
  try {
    const path = limit
      ? `/category/${encodeURIComponent(category)}?limit=${limit}`
      : `/category/${encodeURIComponent(category)}`;
    const jokes = await jget(path);
    renderJokes(category, jokes);
  } catch (err) {
    console.error(err);
    q("#jokes-container").textContent =
      "Could not load jokes for this category.";
  }
}

/* ---------- UI helpers ---------- */

function renderRandom(j) {
  const box = q("#random-joke");
  box.innerHTML = "";
  if (!j) {
    box.textContent = "No jokes yet. Add one below!";
    return;
  }
  box.appendChild(jokeCard(j));
}

function renderCategories(cats) {
  const row = q("#category-list");
  row.innerHTML = "";
  cats.forEach((cat) => {
    const chip = el("button", "chip");
    chip.textContent = cat;
    chip.addEventListener("click", () => {
      selectedCategory = cat;
      q("#cat-title").textContent = `Jokes by Category: ${cat}`;
      loadByCategory(cat, getLimit());
    });
    row.appendChild(chip);
  });
}

function renderJokes(category, jokes) {
  const grid = q("#jokes-container");
  grid.innerHTML = "";
  if (!jokes || jokes.length === 0) {
    grid.textContent = `No jokes found for "${category}".`;
    return;
  }
  jokes.forEach((j) => grid.appendChild(jokeCard(j)));
}

function jokeCard(j) {
  const card = el("div", "card", "joke");
  const setup = el("div", "setup");
  setup.textContent = j.setup;
  const delivery = el("div", "delivery");
  delivery.textContent = j.delivery;
  const cat = el("div", "muted");
  cat.textContent = `#${j.category}`;
  card.append(setup, delivery, cat);
  return card;
}

function toast(msg) {
  q("#add-status").textContent = msg;
  setTimeout(() => (q("#add-status").textContent = ""), 2500);
}

function getLimit() {
  const val = q("#limit-input").value.trim();
  const n = parseInt(val, 10);
  return Number.isInteger(n) && n > 0 ? n : undefined;
}

/* ---------- network helpers ---------- */
async function jget(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/* ---------- tiny DOM helpers ---------- */
function q(sel) {
  return document.querySelector(sel);
}

function el(tag, ...cls) {
  const x = document.createElement(tag);
  if (cls.length) x.classList.add(...cls);
  return x;
}