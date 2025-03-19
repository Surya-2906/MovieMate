const express = require('express');
const axios = require('axios');
const Movie = require('../models/Movie');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
require('dotenv').config();

const OMDB_API_KEY = process.env.OMDB_API_KEY;

// 🔍 Search Movies from OMDb
router.get('/search/:title', async (req, res) => {
    try {
        const { title } = req.params;
        const response = await axios.get(`https://www.omdbapi.com/?s=${title}&apikey=${OMDB_API_KEY}`);

        if (response.data.Response === 'False') {
            return res.status(404).json({ error: response.data.Error });
        }

        res.json(response.data);
    } catch (err) {
        console.error('OMDb Search Error:', err.message);
        res.status(500).json({ error: 'Error fetching movies' });
    }
});

// ➕ Add to Watchlist
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, imdbId, poster } = req.body;

        const newMovie = new Movie({
            title,
            imdbId,
            poster,
            userId: req.user.userId,
        });

        const savedMovie = await newMovie.save();
        res.status(201).json(savedMovie);
    } catch (err) {
        console.error('Add Movie Error:', err.message);
        res.status(400).json({ error: 'Error saving the movie' });
    }
});

// 📄 Get Watchlist
router.get('/', authMiddleware, async (req, res) => {
    try {
        const movies = await Movie.find({ userId: req.user.userId });
        res.json(movies);
    } catch (err) {
        console.error('Fetch Watchlist Error:', err.message);
        res.status(500).json({ error: 'Error fetching watchlist' });
    }
});

// ❌ Remove from Watchlist
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const movie = await Movie.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userId,
        });

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found or unauthorized' });
        }

        res.json({ message: 'Movie removed from watchlist' });
    } catch (err) {
        console.error('Delete Movie Error:', err.message);
        res.status(500).json({ error: 'Error deleting the movie' });
    }
});

module.exports = router;
