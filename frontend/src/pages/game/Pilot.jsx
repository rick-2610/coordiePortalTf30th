import React, { useState, useEffect } from "react";
import axios from "axios";
import Game from "./Game";
import Leaderboard from "./Leaderboard";
import HomePage from "./HomePage";
import styled from "styled-components";
import GlobalStyle from "./GlobalStyles";
import SHA256 from "crypto-js/sha256";

// Matches backend perfectly
const SECRET_SALT = process.env.REACT_APP_SECRET_SALT;

export default function Pilot() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
    // REMOVED: gameStartTime state is no longer needed on the frontend

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

    const handlePlayerCreated = (playerData) => {
        setPlayer(playerData);
        localStorage.setItem("flappyPlayer", JSON.stringify(playerData));
    };

    const handleLogout = () => {
        localStorage.removeItem("flappyPlayer");
        setPlayer(null);
    };

    // SECURE: Tell the Django server to start its own clock
    const handleGameStart = async () => {
        if (player) {
            try {
                await axios.post(
                    `https://coordi.techfest.org/player/${player.id}/start_game/`,
                );
            } catch (error) {
                console.error("Could not start server stopwatch:", error);
            }
        }
    };

    const handleGameOver = async (finalScore) => {
        setScore(finalScore);
        setCurrentScore(0);
        setShowLeaderboard(true);

        if (player) {
            // SECURE: We only hash the score and salt. Time is handled by Django now.
            const signature = SHA256(`${finalScore}${SECRET_SALT}`).toString();

            try {
                const response = await axios.patch(
                    `https://coordi.techfest.org/player/${player.id}/update_score/`,
                    {
                        score: finalScore,
                        signature: signature, // No more start_time payload sent to server!
                    },
                );

                const updatedPlayer = response.data;
                setPlayer(updatedPlayer);
                localStorage.setItem(
                    "flappyPlayer",
                    JSON.stringify(updatedPlayer),
                );

                console.log("Verified score saved for player:", player.name);
            } catch (error) {
                console.error("Score rejected by server reality check:", error);
            }
        }
    };

    if (!player) {
        return (
            <AppContainer>
                <GlobalStyle />
                <HomePage onPlayerCreated={handlePlayerCreated} />
            </AppContainer>
        );
    }

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
                <HeaderControls />
            </AppHeader>

            {isMobile ? (
                <MainContentP>
                    <p
                        style={{
                            fontWeight: "bold",
                            borderRadius: "18px",
                            color: "#d6a138",
                            textAlign: "left",
                        }}
                    >
                        Put your high score on Instagram story and tag{" "}
                        <a
                            href="https://www.instagram.com/techfest_iitbombay/"
                            target="_blank"
                            rel="noreferrer"
                            style={{ textDecoration: "underline" }}
                        >
                            Techfest
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
                            onGameStart={handleGameStart}
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
                            color: "#d6a138",
                            textAlign: "left",
                        }}
                    >
                        Put your high score on Instagram story
                        <br /> and tag{" "}
                        <a
                            href="https://www.instagram.com/techfest_iitbombay/"
                            target="_blank"
                            rel="noreferrer"
                            style={{ textDecoration: "underline" }}
                        >
                            Techfest
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
                    <div style={{ transform: "translateX(-30vw)" }}>
                        <Game
                            onGameOver={handleGameOver}
                            onGameStart={handleGameStart}
                            onScoreUpdate={(s) => setCurrentScore(s)}
                            initialHighScore={player ? player.score : 0}
                        />
                    </div>
                </MainContent>
            )}
        </AppContainer>
    );
}

// Styled components remain exactly as you provided them
const AppContainer = styled.div`
    padding-top: 100px;
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
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
    color: #fff;
`;

const AppHeader = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    padding: 15px 30px;
    background: rgba(0, 255, 255, 0.05);
    border-bottom: 1px solid rgba(0, 255, 255, 0.2);
    box-shadow: 0 2px 10px rgba(0, 255, 255, 0.1);
    backdrop-filter: blur(4px);
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
`;

const MainContent = styled.div`
    flex-grow: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 50px;
`;

const MainContentP = styled.div`
    flex-grow: 1;
    display: flex;
    justify-content: start;
    align-items: center;
    flex-direction: column;
    padding: 10px;
`;
