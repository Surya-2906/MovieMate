import React, { useEffect, useState } from "react";
import axios from "axios";

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        fetchWatchlist();
    }, []);

    const fetchWatchlist = async () => {
        const response = await axios.get("http://localhost:5000/api/movies");
        setWatchlist(response.data);
    };

    const markAsWatched = async (id) => {
        await axios.put(`http://localhost:5000/api/movies/${id}/watched`);
        setWatchlist((prev) =>
            prev.map((movie) => (movie._id === id ? { ...movie, watched: true } : movie))
        );
    };

    return (
        <div>
            <h2>My Watchlist</h2>
            <ul>
                {watchlist.map((movie) => (
                    <li key={movie._id}>
                        <h3>{movie.title}</h3>
                        <button onClick={() => markAsWatched(movie._id)}>
                            {movie.watched ? "✅ Watched" : "Mark as Watched"}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Watchlist;
