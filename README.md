Jokebook (Assignment 7)

A small Node.js app using Express and PostgreSQL (Neon).
You can view random jokes, browse by category, and add your own.

⸻

Features
	•	Show a random joke
	•	Browse jokes by category
	•	Add new jokes
	•	Data stored in a Neon Postgres database

⸻

API Endpoints
	•	GET /jokebook/categories – all categories
	•	GET /jokebook/category/:category?limit=N – jokes by category
	•	GET /jokebook/random – one random joke
	•	POST /jokebook/joke/add – add a new joke

⸻

Setup
	1.	Copy the example env file and add your Neon DB URL:
cp .env.example .env
	2.	Install dependencies:
npm install
	3.	Create tables:
npm run db:setup
	4.	(Optional) Add sample data:
npm run db:seed
	5.	Run the server:
npm run dev → http://localhost:3000￼


demo video:
https://uncg-my.sharepoint.com/:v:/r/personal/a_tesfaye_uncg_edu/Documents/assignment7.mp4?csf=1&web=1&e=m9UpJ8 