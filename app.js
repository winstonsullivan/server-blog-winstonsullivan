// app.js
import express from 'express';
import router from './controllers/routes.js'; // Importing routes

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use('/', router); // Using router for all routes

const PORT = process.env.PORT || 3000; // Setting port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Starting server
