import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Game.css";
import spaceship from "./assets/spaceship.png";

// Game constants (Adjusted for Easy Mode)
const BIRD_SIZE = 35; // Slightly smaller hitbox
const GAME_WIDTH = 400;
const GAME_HEIGHT = 400;
const GRAVITY = 0.5;
const JUMP_VELOCITY = -6;
const JUMP_HEIGHT = 72;
const PIPE_EXTRA_HEIGHT = 300;
const PIPE_WIDTH = 60;
const PIPE_GAP = 140;
const OBSTACLE_SPEED = 1; // Slower moving pipes
const OBSTACLE_RANGE = 30; // Moving pipes don't travel as far

// Game Over Messages
const LOW_SCORE_MESSAGES = [
    "Bro really thought he was built different. 💀",
    "Insufficient aura, join us to gain some!!",
    "DD grade level gameplay",
    "Our prizes said 'not for you, bestie.'",
    "We set the bar low. You found a way under it.",
    "We're not mad. We're just… disappointed. Actually we're a little mad.",
    "This is NOT what Asia's largest fest deserves from you.",
    "Genuinely concerning. Please hydrate and retry.",
    "Main character energy. Side character score.",
    "The game is not the problem. Just to clarify.",
    "It's okay. Not everyone wins. Some people just… watch.",
    "We believe in you. We also believe in miracles. Try again.",
    "A pigeon scored higher. We're not joking.",
    "This is a certified low point. Screenshot it for the memories.",
    "History will not remember this moment. Neither will we. Try again.",
    "In another universe, you did better. Be him.",
    "The prizes were right there. They saw everything.",
    "You had the time. You had the device. You had one job.",
    "The game didn't beat you. You beat you. Reflect.",
];

const HIGH_SCORE_MESSAGES = [
    "That was the warm up. Now go.",
    "The prizes are still there. So are you. Coincidence?",
    "You didn't come this far to only come this far.",
    "The stage is being set. Make sure you're on it.",
    "The leaderboard has space at the top. Just saying.",
    "Breathe. Reset. Dominate.",
    "It's not over until YOUR score is up there.",
    "The game respects the ones who come back.",
    "Prizes worth ₹50K are waiting for someone with your energy. Prove it.",
    "Insufficient aura, join us to gain some!!",
];

const Game = ({ onScoreUpdate, onGameOver, initialHighScore = 0 }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 480);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const TIME = !isMobile ? 1100 : 2000;

    const GAME_SPAWN_WIDTH = !isMobile ? GAME_WIDTH / 2 : GAME_WIDTH / 2;
    const LEFT = !isMobile ? 5 : 3; // Slower scroll speed

    const [birdPosition, setBirdPosition] = useState(GAME_HEIGHT / 2);
    const [pipes, setPipes] = useState([]);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(initialHighScore);
    const [gameOverMessage, setGameOverMessage] = useState("");

    // State to hold the global top score fetched from the API
    const [globalTopScore, setGlobalTopScore] = useState(0);

    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);

    const velocityRef = useRef(0);
    const rafRef = useRef(null);
    const lastTimeRef = useRef(null);
    const isGameOverRef = useRef(isGameOver);

    // Ref to hold the latest onScoreUpdate function
    const onScoreUpdateRef = useRef(onScoreUpdate);

    useEffect(() => {
        isGameOverRef.current = isGameOver;
    }, [isGameOver]);

    useEffect(() => {
        setHighScore((prev) => Math.max(prev, initialHighScore));
    }, [initialHighScore]);

    useEffect(() => {
        onScoreUpdateRef.current = onScoreUpdate;
    }, [onScoreUpdate]);

    // Fetch the global top score using Axios when the game loads
    useEffect(() => {
        const fetchGlobalTopScore = async () => {
            try {
                // Adjust this URL if your Django server is running on a different port/host
                const response = await axios.get(
                    "https://coordi.techfest.org/player/scores/global-top/",
                );
                setGlobalTopScore(response.data.top_score);
                console.log(response.data.top_score);
            } catch (error) {
                console.error("Failed to fetch global top score:", error);
            }
        };

        fetchGlobalTopScore();
    }, []);

    // Pipes & pipe movement
    useEffect(() => {
        let pipeGeneratorInterval;
        let pipeMovementInterval;

        if (isGameStarted && !isGameOver) {
            pipeMovementInterval = setInterval(() => {
                setPipes((currentPipes) => {
                    let pointsScored = 0;

                    const newPipes = currentPipes
                        .map((pipe) => {
                            const newPipe = { ...pipe };

                            if (
                                newPipe.left + PIPE_WIDTH <
                                    GAME_SPAWN_WIDTH / 3 &&
                                !newPipe.passed
                            ) {
                                pointsScored += 1;
                                newPipe.passed = true;
                            }

                            if (newPipe.isObstacle) {
                                newPipe.verticalShift +=
                                    newPipe.verticalDirection * OBSTACLE_SPEED;
                                if (
                                    Math.abs(newPipe.verticalShift) >=
                                    OBSTACLE_RANGE
                                ) {
                                    newPipe.verticalDirection *= -1;
                                }
                            }

                            newPipe.left -= LEFT;
                            return newPipe;
                        })
                        .filter((pipe) => pipe.left > -PIPE_WIDTH);

                    // Update the score functionally if a point was scored
                    if (pointsScored > 0) {
                        setScore((prevScore) => {
                            const updatedScore = prevScore + pointsScored;
                            if (onScoreUpdateRef.current) {
                                onScoreUpdateRef.current(updatedScore);
                            }
                            return updatedScore;
                        });
                    }

                    return newPipes;
                });
            }, 24);

            pipeGeneratorInterval = setInterval(() => {
                if (!isGameOverRef.current) {
                    const topPipeHeight = Math.floor(
                        Math.random() * (GAME_HEIGHT - PIPE_GAP),
                    );
                    // Reduced obstacle frequency for Easy Mode
                    const isObstacle = Math.random() > 0.9;
                    setPipes((prevPipes) => [
                        ...prevPipes,
                        {
                            left: GAME_WIDTH,
                            topPipeHeight: topPipeHeight,
                            bottomPipeHeight:
                                GAME_HEIGHT - topPipeHeight - PIPE_GAP,
                            passed: false,
                            isObstacle: isObstacle,
                            verticalShift: 0,
                            verticalDirection: 1,
                        },
                    ]);
                }
            }, TIME);
        }

        return () => {
            clearInterval(pipeMovementInterval);
            clearInterval(pipeGeneratorInterval);
        };
    }, [isGameStarted, isGameOver, GAME_SPAWN_WIDTH, LEFT]);

    // Collision Detection
    useEffect(() => {
        if (!isGameStarted || isGameOver) return;

        if (birdPosition >= GAME_HEIGHT - BIRD_SIZE) {
            handleGameOver();
            return;
        }

        for (let pipe of pipes) {
            const topPipeBottom = pipe.topPipeHeight + pipe.verticalShift;
            const bottomPipeTop =
                GAME_HEIGHT - pipe.bottomPipeHeight + pipe.verticalShift;
            const birdIsAtPipeX =
                pipe.left < GAME_SPAWN_WIDTH / 3 + BIRD_SIZE &&
                pipe.left + PIPE_WIDTH > GAME_SPAWN_WIDTH / 3;
            const birdHitsTopPipe = birdPosition < topPipeBottom;
            const birdHitsBottomPipe = birdPosition + BIRD_SIZE > bottomPipeTop;
            if (birdIsAtPipeX && (birdHitsTopPipe || birdHitsBottomPipe)) {
                handleGameOver();
                return;
            }
        }
    }, [birdPosition, pipes, isGameStarted, isGameOver]);

    // Physics Loop
    useEffect(() => {
        if (!isGameStarted || isGameOver) {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
                lastTimeRef.current = null;
            }
            return;
        }

        const loop = (time) => {
            if (!lastTimeRef.current) lastTimeRef.current = time;
            const dt = time - lastTimeRef.current;
            lastTimeRef.current = time;

            const scale = dt / 24;

            velocityRef.current += GRAVITY * scale;

            setBirdPosition((prev) => {
                let next = prev + velocityRef.current * scale;

                if (next < 0) {
                    next = 0;
                    velocityRef.current = 0;
                }

                if (next > GAME_HEIGHT - BIRD_SIZE) {
                    next = GAME_HEIGHT - BIRD_SIZE;
                    velocityRef.current = 0;
                }

                return next;
            });

            rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
            lastTimeRef.current = null;
        };
    }, [isGameStarted, isGameOver]);

    const startGame = () => {
        setBirdPosition(GAME_HEIGHT / 2);
        setPipes([]);
        setScore(0);
        setGameOverMessage(""); // Reset message
        if (onScoreUpdateRef.current) onScoreUpdateRef.current(0);
        setIsGameOver(false);
        setIsGameStarted(true);
        velocityRef.current = 0;
    };

    const handleGameOver = () => {
        if (isGameOverRef.current) return;
        setIsGameOver(true);
        setIsGameStarted(false);

        // Calculate and pick the random message based on the score
        const messages = score <= 30 ? LOW_SCORE_MESSAGES : HIGH_SCORE_MESSAGES;
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        setGameOverMessage(randomMsg);

        const newHighScore = Math.max(score, highScore);
        setHighScore(newHighScore);

        // Update the global top score in local state if the player just beat it
        if (newHighScore > globalTopScore) {
            setGlobalTopScore(newHighScore);
        }

        onGameOver(newHighScore);
    };

    const handleJump = () => {
        if (isGameOver) return;
        if (!isGameStarted) {
            startGame();
        }
        velocityRef.current = JUMP_VELOCITY;
    };

    const handleJumpRef = useRef(handleJump);
    useEffect(() => {
        handleJumpRef.current = handleJump;
    }, [handleJump]);

    useEffect(() => {
        const onKeyDown = (e) => {
            const tag = e.target && e.target.tagName;
            if (
                tag === "INPUT" ||
                tag === "TEXTAREA" ||
                e.target.isContentEditable
            )
                return;

            if (
                e.code === "Space" ||
                e.key === " " ||
                e.key === "Spacebar" ||
                e.keyCode === 32
            ) {
                e.preventDefault();
                if (handleJumpRef.current) handleJumpRef.current();
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    // Calculate how far the player is from the top score
    const effectiveTopScore = Math.max(globalTopScore, highScore);
    const pointsAway = effectiveTopScore - highScore;

    return (
        <div className="game-area" onClick={handleJump}>
            <div className="score-display">
                Score: <strong>{score}</strong> | High Score:{" "}
                <strong>{highScore}</strong>
            </div>

            <img
                src={spaceship}
                alt="spaceship"
                className="bird"
                style={{
                    top: `${birdPosition}px`,
                    left: `${GAME_SPAWN_WIDTH / 3}px`,
                    width: `${BIRD_SIZE}px`,
                    height: `${BIRD_SIZE}px`,
                }}
            />

            {pipes.map((pipe, index) => (
                <div key={index}>
                    <div
                        className="pipe top"
                        style={{
                            left: `${pipe.left}px`,
                            height: `${pipe.topPipeHeight + PIPE_EXTRA_HEIGHT}px`,
                            top: `-${PIPE_EXTRA_HEIGHT}px`,
                            transform: `translateY(${pipe.verticalShift}px)`,
                            width: `${PIPE_WIDTH}px`,
                        }}
                    />
                    <div
                        className="pipe bottom"
                        style={{
                            left: `${pipe.left}px`,
                            height: `${pipe.bottomPipeHeight + PIPE_EXTRA_HEIGHT}px`,
                            bottom: `-${PIPE_EXTRA_HEIGHT}px`,
                            transform: `translateY(${pipe.verticalShift}px)`,
                            width: `${PIPE_WIDTH}px`,
                        }}
                    />
                </div>
            ))}

            {!isGameStarted && !isGameOver && (
                <div className="start-screen">
                    <h2>Flappy Bird</h2>
                    <p>Click anywhere to Start</p>
                </div>
            )}

            {isGameOver && (
                <div className="game-over">
                    <h2>Game Over</h2>
                    <p>Your Score: {score}</p>
                    <p>High Score: {highScore}</p>

                    <div className="top-score-message">
                        {gameOverMessage && (
                            <p className="hill-top-text">{gameOverMessage}</p>
                        )}
                    </div>

                    <button onClick={startGame}>Retry</button>
                </div>
            )}
        </div>
    );
};

export default Game;
