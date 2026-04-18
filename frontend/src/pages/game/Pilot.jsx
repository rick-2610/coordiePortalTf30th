import React, { useState } from "react";
import axios from "axios";
import Game from "./Game";
import Leaderboard from "./Leaderboard";
import HomePage from "./HomePage";
import styled from "styled-components";
import GlobalStyle from "./GlobalStyles";

export default function Pilot() {
    // useState now checks localStorage for a saved player on initial load.
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 480);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const [player, setPlayer] = useState(() => {
        const savedPlayer = localStorage.getItem("flappyPlayer");
        return savedPlayer ? JSON.parse(savedPlayer) : null;
    });

    const [score, setScore] = useState(null);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [currentScore, setCurrentScore] = useState(0);

    // This function now also saves the new player to localStorage.
    const handlePlayerCreated = (playerData) => {
        setPlayer(playerData);
        localStorage.setItem("flappyPlayer", JSON.stringify(playerData));
    };

    // A function to handle logging out.
    const handleLogout = () => {
        localStorage.removeItem("flappyPlayer");
        setPlayer(null);
    };

    const handleGameOver = async (finalScore) => {
        setScore(finalScore);
        setCurrentScore(0);
        setShowLeaderboard(true);

        if (player) {
            try {
                const response = await axios.patch(
                    `https://coordi.techfest.org/player/${player.id}/update_score/`,
                    {
                        score: finalScore,
                    },
                );

                // CHANGED: Update the player state and localStorage with the new score from the backend response.
                const updatedPlayer = response.data;
                setPlayer(updatedPlayer);
                localStorage.setItem(
                    "flappyPlayer",
                    JSON.stringify(updatedPlayer),
                );

                console.log("Score saved for player:", player.name);
            } catch (error) {
                console.error("Failed to save score:", error);
            }
        }
    };

    // If no player is set, show the HomePage
    if (!player) {
        return (
            <AppContainer>
                <GlobalStyle />
                <HomePage onPlayerCreated={handlePlayerCreated} />
            </AppContainer>
        );
    }

    // Otherwise, show the game
    return (
        <AppContainer>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                    style={{
                        width: "25%",
                        padding: "10px",
                        margin: "10px 0",
                        cursor: "pointer",
                    }}
                    onClick={handleLogout}
                >
                    Switch User
                </button>
            </div>
            <GlobalStyle />
            <AppHeader>
                <TitleText>Flappy Spaceship (Player: {player.name})</TitleText>
                <HeaderControls>
                    {/* <button onClick={() => setShowLeaderboard(true)}>
                        Leaderboard
                    </button> */}
                </HeaderControls>
            </AppHeader>

            {isMobile ? (
                <MainContentP>
                    <p
                        style={{
                            fontWeight: "bold",
                            borderRadius: "18px",
                            color: "yellow",
                            textAlign: "left",
                        }}
                    >
                        Put your high score on Instagram story and tag{" "}
                        <a
                            href="https://www.instagram.com/techfest_iitbombay/"
                            target="_blank"
                        >
                            Techfest, IIT Bombay
                        </a>{" "}
                        to claim these prizes
                        <br />
                        - 10+ Electronic Gadgets
                        <br />
                        - 25+ Group Turf Coupons
                        <br />
                        - 12+ RageRoom Tickets
                        <br />- Free Personalised Merchandise
                    </p>

                    <div style={{ transform: "translateY(-15px)" }}>
                        <Game
                            onGameOver={handleGameOver}
                            onScoreUpdate={(s) => setCurrentScore(s)}
                            initialHighScore={player ? player.score : 0}
                        />
                    </div>
                </MainContentP>
            ) : (
                <MainContent>
                    <p
                        style={{
                            fontWeight: "bold",
                            borderRadius: "18px",
                            color: "#EFBF02",
                            textAlign: "left",
                            marginLeft: "10vw",
                        }}
                    >
                        Put your high score on Instagram story and tag
                        <br />
                        <a
                            href="https://www.instagram.com/techfest_iitbombay/"
                            target="_blank"
                        >
                            Techfest, IIT Bombay
                        </a>{" "}
                        to claim these prizes
                        <br />
                        - 10+ Electronic Gadgets
                        <br />
                        - 25+ Group Turf Coupons
                        <br />
                        - 12+ RageRoom Tickets
                        <br />- Free Personalised Merchandise
                    </p>
                    <div style={{ transform: "translateX(-35vw)" }}>
                        <Game
                            onGameOver={handleGameOver}
                            onScoreUpdate={(s) => setCurrentScore(s)}
                            initialHighScore={player ? player.score : 0}
                        />
                    </div>

                    {/* <Leaderboard
                    visible={showLeaderboard}
                    onClose={() => setShowLeaderboard(false)}
                    lastScore={score}
                    playerName={player.name}
                /> */}
                </MainContent>
            )}
        </AppContainer>
    );
}

const AppContainer = styled.div`
    padding-top: 100px;
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;

    /* --- Space Theme Additions --- */
    /* Add a black gradient overlay on top of the background image using a linear-gradient in background-image */
    background-image:
        linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.85) 0%,
            rgba(0, 0, 0, 0.65) 45%,
            rgba(0, 0, 0, 0.45) 100%
        ),
        url("https://wallpapers.com/images/hd/dark-space-wallpaper-jyc27cfs36u9ceyc.jpg");
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    background-color: #000;
    color: #fff; /* Ensure default text is readable against the dark background */
`;

const AppHeader = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    padding: 15px 30px; /* More padding */
    background: rgba(
        0,
        255,
        255,
        0.05
    ); /* Subtle transparent cyan for header */
    border-bottom: 1px solid rgba(0, 255, 255, 0.2); /* Faint cyan separator */
    box-shadow: 0 2px 10px rgba(0, 255, 255, 0.1); /* Header glow */
    backdrop-filter: blur(
        4px
    ); /* Adds a cool frosted glass effect over the space background */
`;

const TitleText = styled.h1`
    margin: 0;
    font-size: 1.7rem;
    color: #00ffff;
    text-shadow: 0 0 8px rgba(0, 255, 255, 0.7);
`;

const HeaderControls = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;

    div {
        font-size: 1.5rem;
        color: #ff00ff;
        text-shadow: 0 0 5px rgba(255, 0, 255, 0.5);
    }

    button {
        font-size: 1.1rem;
    }

    strong {
        color: #ff00ff;
    }
`;

const MainContent = styled.div`
    flex-grow: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
`;

const MainContentP = styled.div`
    flex-grow: 1;
    display: flex;
    justify-content: start;
    align-items: center;
    flex-direction: column;
    padding: 10px;
`;
