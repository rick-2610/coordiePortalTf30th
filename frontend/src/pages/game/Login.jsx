import React, { useState } from "react";
import { register, login } from "./api";

export default function Login({ onAuthed }) {
    const [mode, setMode] = useState("login"); // "login" | "register"
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        if (!username.trim() || !password) {
            setError("Enter a username and password.");
            return;
        }
        setBusy(true);
        try {
            if (mode === "register") {
                await register(username.trim(), password);
            }
            // Registering doesn't log you in by itself - always follow with
            // a real login so the access/refresh tokens actually get stored.
            await login(username.trim(), password);
            onAuthed();
        } catch (e) {
            setError(e.message);
        } finally {
            setBusy(false);
        }
    }

    return (
        <div style={styles.page}>
            <div style={styles.wrap}>
                <h1 style={styles.title}>Four Keeps</h1>
                <p style={styles.subtitle}>
                    {mode === "login"
                        ? "Log in to create or join a lobby."
                        : "Pick a username - this is who your friends will see in the lobby."}
                </p>
                {error && <p style={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        style={styles.input}
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        style={styles.input}
                        placeholder="Password"
                        type="password"
                        autoComplete={
                            mode === "login"
                                ? "current-password"
                                : "new-password"
                        }
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button style={styles.btn} type="submit" disabled={busy}>
                        {busy
                            ? "..."
                            : mode === "login"
                              ? "Log in"
                              : "Create account"}
                    </button>
                </form>
                <p style={styles.switch}>
                    {mode === "login" ? (
                        <>
                            New here?{" "}
                            <button
                                style={styles.link}
                                onClick={() => {
                                    setMode("register");
                                    setError("");
                                }}
                            >
                                Create an account
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <button
                                style={styles.link}
                                onClick={() => {
                                    setMode("login");
                                    setError("");
                                }}
                            >
                                Log in
                            </button>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        paddingTop: 100,
        paddingBottom: 40,
        background: "linear-gradient(180deg, #0b1220 0%, #0e1a2e 100%)",
        boxSizing: "border-box",
    },
    wrap: {
        maxWidth: 380,
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
    form: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        alignItems: "stretch",
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
    btn: {
        font: "inherit",
        fontWeight: 700,
        padding: "10px 18px",
        borderRadius: 8,
        border: "1px solid #2f5fd6",
        cursor: "pointer",
        background: "#2f5fd6",
        color: "#fff",
        marginTop: 4,
    },
    switch: { marginTop: 16, color: "#93a4c2", fontSize: 14 },
    link: {
        background: "none",
        border: 0,
        color: "#6fa0ff",
        cursor: "pointer",
        font: "inherit",
        padding: 0,
        textDecoration: "underline",
    },
    error: { color: "#ff6b6b" },
};
