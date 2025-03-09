import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MovieSearch = ({ user, setUser }) => {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [showWatchlist, setShowWatchlist] = useState(false);
    const navigate = useNavigate();

    const searchMovies = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/movies/search/${query}`);
            setMovies(response.data.Search || []);
            setShowWatchlist(false);
        } catch (err) {
            console.error("Movie Search Error:", err);
            alert("Failed to search movies");
        }
    };

    const addWatchlist = async (movie) => {
        try {
            await axios.post(
                "http://localhost:5000/api/movies",
                {
                    title: movie.Title,             
                    imdbId: movie.imdbID,
                    poster: movie.Poster
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            alert("Added to Watchlist!");
        } catch (err) {
            console.error("Add to Watchlist Error:", err);
            alert("Failed to add to watchlist");
        }
    };

    const fetchWatchlist = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/movies", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setWatchlist(response.data);
            setShowWatchlist(true);
        } catch (err) {
            console.error("Fetch Watchlist Error:", err);
            alert("Failed to fetch watchlist");
        }
    };

    const removeFromWatchlist = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/movies/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setWatchlist((prev) => prev.filter((movie) => movie._id !== id));
        } catch (err) {
            console.error("Remove Watchlist Error:", err);
            alert("Failed to remove from watchlist");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/");
    };

    const handleHome = () => {
        setQuery("");
        setMovies([]);
        setShowWatchlist(false);
    };

    return (
        <div style={{ position: "relative", minHeight: "100vh" }}>
            
            <div style={{ position: "absolute", top: "10px", right: "20px" }}>
                <button onClick={handleHome} style={{ padding: "6px 12px", borderRadius: "6px" }}>
                    Home
                </button>
            </div>

            
            <div
                className="center-content"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    textAlign: "center",
                    padding: "20px"
                }}
            >
                <h2>Welcome, {user?.email}</h2>

                
                <div className="search-bar" style={{ marginBottom: "20px" }}>
                    <input
                        type="text"
                        placeholder="Search movies..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{ padding: "8px", width: "250px", marginRight: "10px" }}
                    />
                    <button onClick={searchMovies}>Search</button>
                    <button onClick={fetchWatchlist}>Watchlist</button>
                    <button onClick={handleLogout}>Logout</button>
                </div>

                
                <div className="results-section">
                    {!showWatchlist ? (
                        movies.map((movie) => (
                            <div key={movie.imdbID} className="movie-card" style={{ marginBottom: "15px" }}>
                                <img src={movie.Poster} alt={movie.Title} height="150" />
                                <h3>{movie.Title}</h3>
                                <button onClick={() => addWatchlist(movie)}>Add to Watchlist</button>
                            </div>
                        ))
                    ) : (
                        <>
                            <h3>Your Watchlist</h3>
                            {watchlist.length > 0 ? (
                                watchlist.map((movie) => (
                                    <div key={movie._id} className="movie-card" style={{ marginBottom: "15px" }}>
                                        <img src={movie.poster} alt={movie.title} height="150" />
                                        <h3>{movie.title}</h3>
                                        <button onClick={() => removeFromWatchlist(movie._id)}>Remove</button>
                                    </div>
                                ))
                            ) : (
                                <p>No movies in watchlist.</p>
                            )}
                            <button onClick={() => setShowWatchlist(false)} style={{ marginTop: "10px" }}>
                                Back to Search
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieSearch;
