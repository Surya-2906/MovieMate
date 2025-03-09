const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    imdbId: {
        type: String,
        required: true
    },
    poster: {
        type: String,
        required: true
    },
    watched: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Movie', movieSchema);
