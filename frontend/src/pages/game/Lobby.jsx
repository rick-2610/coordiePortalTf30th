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
        <div style={styles.page}>
            <div style={styles.wrap}>
                <h1 style={styles.title}>Four Keeps</h1>
                <p style={styles.subtitle}>
                    Create a lobby and share the code, or join one you were
                    given.
                </p>
                {error && <p style={styles.error}>{error}</p>}
                <button style={styles.btn} onClick={handleCreate}>
                    Create lobby
                </button>
                <div
                    style={{
                        margin: "20px 0",
                        display: "flex",
                        justifyContent: "center",
                        gap: 8,
                    }}
                >
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
        </div>
    );
}

function LobbyRoom({ code }) {
    // Mounting GameCanvas immediately keeps a single WebSocket connection alive
    // across the lobby -> playing transition; GameCanvas itself switches its UI
    // based on `phase` from the socket state.
    return (
        <div style={styles.page}>
            <GameCanvas code={code} />
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        paddingTop: 100, // clears the fixed navbar — adjust to match its real height
        paddingBottom: 40,
        background: "linear-gradient(180deg, #0b1220 0%, #0e1a2e 100%)",
        boxSizing: "border-box",
    },
    wrap: {
        maxWidth: 420,
        margin: "0 auto",
        fontFamily: "system-ui,sans-serif",
        textAlign: "center",
        color: "#e6ecf5",
    },
    title: {
        fontWeight: 800,
        letterSpacing: 0.5,
        color: "#eaf1ff",
        marginBottom: 4,
    },
    subtitle: {
        color: "#93a4c2",
        marginBottom: 20,
    },
    btn: {
        font: "inherit",
        fontWeight: 700,
        padding: "10px 18px",
        borderRadius: 8,
        border: "1px solid #2f5fd6",
        cursor: "pointer",
        background: "#2f5fd6",
        color: "#fff",
        transition: "background .15s ease",
    },
    input: {
        font: "inherit",
        padding: "10px 12px",
        borderRadius: 8,
        border: "1px solid #2a3a58",
        background: "#131e30",
        color: "#e6ecf5",
        outline: "none",
    },
    error: { color: "#ff6b6b" },
};

export { SEAT_NAMES };
