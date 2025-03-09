import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./components/Auth";
import MovieSearch from "./components/MovieSearch";

function App() {
    const [user, setUser] = useState(null);

    return (
        <Router>
            <Routes>
                <Route path="/" element={!user ? <Auth setUser={setUser} /> : <Navigate to="/movies" />} />
                <Route path="/movies" element={user ? <MovieSearch user={user} setUser={setUser} /> : <Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
