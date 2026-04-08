import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Game.css";
import spaceship from "./assets/spaceship.png";

// Game constants
const BIRD_SIZE = 35;
const GAME_WIDTH = 400;
const GAME_HEIGHT = 400;
const GRAVITY = 0.5;
const JUMP_VELOCITY = -7;
const JUMP_HEIGHT = 72;
const PIPE_EXTRA_HEIGHT = 300;
const PIPE_WIDTH = 60;
const PIPE_GAP = 140;
const OBSTACLE_SPEED = 2;
const OBSTACLE_RANGE = 50;

const Game = ({ onScoreUpdate, onGameOver, initialHighScore = 0 }) => {
    const [birdPosition, setBirdPosition] = useState(GAME_HEIGHT / 2);
    const [pipes, setPipes] = useState([]);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(initialHighScore);

    // State to hold the global top score fetched from the API
    const [globalTopScore, setGlobalTopScore] = useState(0);

    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);

    const velocityRef = useRef(0);
    const rafRef = useRef(null);
    const lastTimeRef = useRef(null);
    const isGameOverRef = useRef(isGameOver);

    useEffect(() => {
        isGameOverRef.current = isGameOver;
    }, [isGameOver]);

    useEffect(() => {
        setHighScore((prev) => Math.max(prev, initialHighScore));
    }, [initialHighScore]);

    // Fetch the global top score using Axios when the game loads
    useEffect(() => {
        const fetchGlobalTopScore = async () => {
            try {
                // Adjust this URL if your Django server is running on a different port/host
                const response = await axios.get(
                    "http://13.223.126.6:8000/player/scores/global-top/",
                );
                // Axios automatically parses JSON and places the payload in the `data` property
                setGlobalTopScore(response.data.top_score);
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
                    let newScore = score;
                    const newPipes = currentPipes
                        .map((pipe) => {
                            const newPipe = { ...pipe };

                            if (
                                newPipe.left + PIPE_WIDTH < GAME_WIDTH / 2 &&
                                !newPipe.passed
                            ) {
                                newScore++;
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

                            newPipe.left -= 3.5;
                            return newPipe;
                        })
                        .filter((pipe) => pipe.left > -PIPE_WIDTH);

                    if (newScore !== score) {
                        setScore(newScore);
                        onScoreUpdate(newScore);
                    }

                    return newPipes;
                });
            }, 24);

            pipeGeneratorInterval = setInterval(() => {
                if (!isGameOverRef.current) {
                    const topPipeHeight = Math.floor(
                        Math.random() * (GAME_HEIGHT - PIPE_GAP),
                    );
                    const isObstacle = Math.random() > 0.8;
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
            }, 1600);
        }

        return () => {
            clearInterval(pipeMovementInterval);
            clearInterval(pipeGeneratorInterval);
        };
    }, [isGameStarted, isGameOver, score, onScoreUpdate]);

    useEffect(() => {
        if (!isGameStarted || isGameOver) return;

        if (birdPosition > GAME_HEIGHT - BIRD_SIZE) {
            handleGameOver();
            return;
        }

        for (let pipe of pipes) {
            const topPipeBottom = pipe.topPipeHeight + pipe.verticalShift;
            const bottomPipeTop =
                GAME_HEIGHT - pipe.bottomPipeHeight + pipe.verticalShift;
            const birdIsAtPipeX =
                pipe.left < GAME_WIDTH / 3 + BIRD_SIZE &&
                pipe.left + PIPE_WIDTH > GAME_WIDTH / 3;
            const birdHitsTopPipe = birdPosition < topPipeBottom;
            const birdHitsBottomPipe = birdPosition + BIRD_SIZE > bottomPipeTop;
            if (birdIsAtPipeX && (birdHitsTopPipe || birdHitsBottomPipe)) {
                handleGameOver();
                return;
            }
        }
    }, [birdPosition, pipes, isGameStarted, isGameOver]);

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
                    handleGameOver();
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
        onScoreUpdate(0);
        setIsGameOver(false);
        setIsGameStarted(true);
        velocityRef.current = 0;
    };

    const handleGameOver = () => {
        if (isGameOverRef.current) return;
        setIsGameOver(true);
        setIsGameStarted(false);

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
                    left: `${GAME_WIDTH / 3}px`,
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
                        }}
                    />
                    <div
                        className="pipe bottom"
                        style={{
                            left: `${pipe.left}px`,
                            height: `${pipe.bottomPipeHeight + PIPE_EXTRA_HEIGHT}px`,
                            bottom: `-${PIPE_EXTRA_HEIGHT}px`,
                            transform: `translateY(${pipe.verticalShift}px)`,
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
                        {pointsAway === 0 ? (
                            <p className="hill-top-text">
                                You are currently at the top of the hill
                            </p>
                        ) : (
                            <p className="keep-trying-text">
                                You are {pointsAway} points away from the top!
                                Keep trying
                            </p>
                        )}
                    </div>

                    <button onClick={startGame}>Retry</button>
                </div>
            )}
        </div>
    );
};

export default Game;
