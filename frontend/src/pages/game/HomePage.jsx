import React, { useState } from "react";
import axios from "axios";

// The 'onPlayerCreated' prop is a function passed down from App.js
export default function HomePage({ onPlayerCreated }) {
    const [name, setName] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!name.trim()) {
            setError("Please enter a name.");
            return;
        }
        setError(null);

        try {
            // API call to your Django backend to create the player
            const response = await axios.post(
                "https://coordie.techfest.org/player/create/",
                {
                    name: name,
                },
            );

            // Call the function from App.js with the new player data
            onPlayerCreated(response.data);
        } catch (err) {
            console.error("Error creating player:", err);
            const errorMessage =
                err.response?.data?.name?.[0] ||
                "An error occurred. Please try again.";
            setError(errorMessage);
        }
    };

    return (
        <div
            style={{
                textAlign: "center",
                marginTop: "100px",
                fontFamily: "sans-serif",
            }}
        >
            <h1>Flappy Spaceship</h1>
            <p>
                Enter your roll no. of the form 25bXXXX to start playing and
                save your score.
            </p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="25bXXXX"
                    style={{
                        padding: "12px",
                        fontSize: "16px",
                        marginRight: "10px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        color: "black",
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: "12px 24px",
                        fontSize: "16px",
                        cursor: "pointer",
                        borderRadius: "4px",
                        border: "none",
                        background: "#53073aff",
                        color: "white",
                    }}
                >
                    Start Game
                </button>
            </form>
            {error && (
                <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
            )}
        </div>
    );
}
