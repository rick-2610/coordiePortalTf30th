import React, { useState } from "react";
import { createLobby, joinLobby } from "./api";
import { GameCanvas } from "./GameCanvas";

const SEAT_NAMES = [
    "South (bottom)",
    "West (left)",
    "North (top)",
    "East (right)",
];

export default function Lobby() {
    const [code, setCode] = useState(null);
    const [joinCode, setJoinCode] = useState("");
    const [error, setError] = useState("");

    async function handleCreate() {
        setError("");
        try {
            const lobby = await createLobby();
            setCode(lobby.code);
        } catch (e) {
            setError(e.message);
        }
    }

    async function handleJoin() {
        setError("");
        try {
            const lobby = await joinLobby(joinCode.trim().toUpperCase());
            setCode(lobby.code);
        } catch (e) {
            setError(e.message);
        }
    }

    if (code) {
        return <LobbyRoom code={code} />;
    }

    return (
        <div style={styles.wrap}>
            <h1>Four Keeps</h1>
            <p>
                Create a lobby and share the code, or join one you were given.
            </p>
            {error && <p style={styles.error}>{error}</p>}
            <button style={styles.btn} onClick={handleCreate}>
                Create lobby
            </button>
            <div style={{ margin: "16px 0" }}>
                <input
                    style={styles.input}
                    placeholder="Lobby code"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                />
                <button style={styles.btn} onClick={handleJoin}>
                    Join lobby
                </button>
            </div>
        </div>
    );
}

function LobbyRoom({ code }) {
    // Mounting GameCanvas immediately keeps a single WebSocket connection alive
    // across the lobby -> playing transition; GameCanvas itself switches its UI
    // based on `phase` from the socket state.
    return <GameCanvas code={code} />;
}

const styles = {
    wrap: {
        maxWidth: 420,
        margin: "60px auto",
        fontFamily: "system-ui,sans-serif",
        textAlign: "center",
    },
    btn: {
        font: "inherit",
        fontWeight: 700,
        padding: "10px 16px",
        borderRadius: 8,
        border: 0,
        cursor: "pointer",
        background: "#8a6a12",
        color: "#fff",
    },
    input: {
        font: "inherit",
        padding: "10px 12px",
        borderRadius: 8,
        border: "1px solid #ccc",
        marginRight: 8,
    },
    error: { color: "#c0392b" },
};

export { SEAT_NAMES };
