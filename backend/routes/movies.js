const express = require('express');
const axios = require('axios');
const Movie = require('../models/Movie');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
require('dotenv').config();

const OMDB_API_KEY = process.env.OMDB_API_KEY;

// Search Movies
router.get("/search/:title", async (req, res) => {
    try {
        const { title } = req.params;
        const response = await axios.get(`https://www.omdbapi.com/?s=${title}&apikey=${OMDB_API_KEY}`);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: "Error fetching movies" });
    }
});

// Add to Watchlist
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, imdbId, poster } = req.body;
        const newMovie = new Movie({
            title,
            imdbId,
            poster,
            userId: req.user.userId
        });
        await newMovie.save();
        res.status(201).json(newMovie);
    } catch (err) {
        res.status(400).json({ error: "Error Saving the Movie" });
    }
});

// Get Watchlist
router.get("/", authMiddleware, async (req, res) => {
    try {
        const movies = await Movie.find({ userId: req.user.userId });
        res.json(movies);
    } catch (err) {
        res.status(500).json({ error: "Error fetching watchlist" });
    }
});

// Delete Movie
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const movie = await Movie.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
        if (!movie) {
            return res.status(404).json({ message: "Movie not found or unauthorized" });
        }
        res.json({ message: "Movie removed from watchlist" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting the movie" });
    }
});

module.exports = router;
