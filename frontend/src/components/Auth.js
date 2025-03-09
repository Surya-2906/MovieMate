import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Auth = ({ setUser }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const url = isLogin ? "http://localhost:5000/api/auth/login" : "http://localhost:5000/api/auth/register";
            const response = await axios.post(url, { email, password });

            localStorage.setItem("token", response.data.token);
            setUser(response.data.user);
            navigate("/movies"); 
        } catch (err) {
            setError(err.response?.data?.message || "Authentication failed");
        }
    };

    return (
        <div className="auth-container">
            <h2>{isLogin ? "Login" : "Sign Up"}</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleAuth}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
            </form>
            <p onClick={() => setIsLogin(!isLogin)} className="toggle-auth">
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </p>
        </div>
    );
};

export default Auth;
