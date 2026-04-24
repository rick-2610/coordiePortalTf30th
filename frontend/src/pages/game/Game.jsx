import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import "./Game.css";
import spaceship from "./assets/spaceship.png";

// ============================================================================
// [FIX APPLIED] ANTI-CHEAT: Lock down requestAnimationFrame
// ============================================================================

// Prevent Canvas Hooking
const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;
const originalFillRect = CanvasRenderingContext2D.prototype.fillRect;

Object.defineProperties(CanvasRenderingContext2D.prototype, {
    drawImage: {
        value: originalDrawImage,
        writable: false,
        configurable: false,
    },
    fillRect: { value: originalFillRect, writable: false, configurable: false },
});

// Prevent React Fiber sniffing (Optional, but helps mask state)
document.addEventListener("contextmenu", (e) => e.preventDefault());

if (typeof window !== "undefined") {
    try {
        const originalRAF = window.requestAnimationFrame;
        Object.defineProperty(window, "requestAnimationFrame", {
            value: originalRAF,
            writable: false,
            configurable: false,
        });
    } catch (e) {
        console.warn("Anti-cheat: Could not lock requestAnimationFrame.");
    }
}
// ============================================================================

const BIRD_SIZE = 35;
const GAME_WIDTH = 400;
const GAME_HEIGHT = 400;
const GRAVITY = 0.5;
const JUMP_VELOCITY = -6;
const JUMP_HEIGHT = 72;
const PIPE_EXTRA_HEIGHT = 300;
const PIPE_WIDTH = 60;
const PIPE_GAP = 140;
const OBSTACLE_SPEED = 1;
const OBSTACLE_RANGE = 30;

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

const Game = ({
    onScoreUpdate,
    onGameOver,
    onGameStart,
    initialHighScore = 0,
}) => {
    const MASK = useMemo(() => Math.floor(Math.random() * 0xffffff), []);
    const [maskedScore, setMaskedScore] = useState(0 ^ MASK);
    const score = maskedScore ^ MASK;

    const jumpLogRef = useRef([]);

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

    // ============================================================================
    // CANVAS REFS
    // ============================================================================
    const canvasRef = useRef(null);
    const spaceshipImgRef = useRef(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 480);
        window.addEventListener("resize", handleResize);

        // Preload the spaceship image for the canvas
        const img = new Image();
        img.src = spaceship;
        spaceshipImgRef.current = img;

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const TIME = !isMobile ? 1200 : 1700;
    const GAME_SPAWN_WIDTH = !isMobile ? GAME_WIDTH / 2 : GAME_WIDTH / 2;
    const LEFT = !isMobile ? 5 : 3;

    const [birdPosition, setBirdPosition] = useState(GAME_HEIGHT / 2);
    const [pipes, setPipes] = useState([]);
    const [highScore, setHighScore] = useState(initialHighScore);
    const [gameOverMessage, setGameOverMessage] = useState("");
    const [globalTopScore, setGlobalTopScore] = useState(0);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);

    const velocityRef = useRef(0);
    const rafRef = useRef(null);
    const lastTimeRef = useRef(null);
    const isGameOverRef = useRef(isGameOver);
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

    useEffect(() => {
        const fetchGlobalTopScore = async () => {
            try {
                const response = await axios.get(
                    "https://coordi.techfest.org/player/scores/global-top/",
                );
                setGlobalTopScore(response.data.top_score);
            } catch (error) {
                console.error("Failed to fetch global top score:", error);
            }
        };
        fetchGlobalTopScore();
    }, []);

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

                    if (pointsScored > 0) {
                        setMaskedScore((prevMasked) => {
                            const currentRealScore = prevMasked ^ MASK;
                            const updatedScore =
                                currentRealScore + pointsScored;

                            if (onScoreUpdateRef.current) {
                                onScoreUpdateRef.current(updatedScore);
                            }
                            return updatedScore ^ MASK;
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
    }, [isGameStarted, isGameOver, GAME_SPAWN_WIDTH, LEFT, MASK]);

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
            let dt = time - lastTimeRef.current;
            lastTimeRef.current = time;

            if (dt > 30) {
                dt = 30;
            }

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

            rafRef.current = window.requestAnimationFrame(loop);
        };

        rafRef.current = window.requestAnimationFrame(loop);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
            lastTimeRef.current = null;
        };
    }, [isGameStarted, isGameOver]);

    // ============================================================================
    // [CANVAS RENDERING LOOP]
    // Replaces the DOM map generation. This fires every time state updates.
    // ============================================================================
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        // Clear the entire canvas for the new frame
        ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // Draw Pipes (Assuming a default green color, change hex if needed)
        ctx.fillStyle = "#2ef2f2";
        pipes.forEach((pipe) => {
            const topPipeBottom = pipe.topPipeHeight + pipe.verticalShift;
            const bottomPipeTop =
                GAME_HEIGHT - pipe.bottomPipeHeight + pipe.verticalShift;

            // Draw Top Pipe
            ctx.fillRect(pipe.left, 0, PIPE_WIDTH, topPipeBottom);

            // Draw Bottom Pipe
            ctx.fillRect(
                pipe.left,
                bottomPipeTop,
                PIPE_WIDTH,
                GAME_HEIGHT - bottomPipeTop,
            );
        });

        // Draw Bird
        if (spaceshipImgRef.current) {
            ctx.drawImage(
                spaceshipImgRef.current,
                GAME_SPAWN_WIDTH / 3, // X position
                birdPosition, // Y position
                BIRD_SIZE, // Width
                BIRD_SIZE, // Height
            );
        }
    }, [birdPosition, pipes]);
    // ============================================================================

    const startGame = () => {
        setBirdPosition(GAME_HEIGHT / 2);
        setPipes([]);
        setMaskedScore(0 ^ MASK);
        jumpLogRef.current = [];
        setGameOverMessage("");
        if (onScoreUpdateRef.current) onScoreUpdateRef.current(0);
        setIsGameOver(false);
        setIsGameStarted(true);
        velocityRef.current = 0;

        if (onGameStart) onGameStart();
    };

    const handleGameOver = () => {
        if (isGameOverRef.current) return;
        setIsGameOver(true);
        setIsGameStarted(false);

        const messages = score <= 30 ? LOW_SCORE_MESSAGES : HIGH_SCORE_MESSAGES;
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        setGameOverMessage(randomMsg);

        const newHighScore = Math.max(score, highScore);
        setHighScore(newHighScore);

        if (newHighScore > globalTopScore) {
            setGlobalTopScore(newHighScore);
        }

        onGameOver(newHighScore, jumpLogRef.current);
    };

    const handleJump = () => {
        if (isGameOver) return;
        if (!isGameStarted) {
            startGame();
        }
        velocityRef.current = JUMP_VELOCITY;

        jumpLogRef.current.push({
            t: Date.now(),
            y: parseFloat(birdPosition.toFixed(2)),
        });
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

    const effectiveTopScore = Math.max(globalTopScore, highScore);
    const pointsAway = effectiveTopScore - highScore;

    return (
        <div
            className="game-area"
            onClick={handleJump}
            style={{
                position: "relative",
                width: GAME_WIDTH,
                height: GAME_HEIGHT,
            }}
        >
            <div
                className="score-display"
                style={{
                    zIndex: 10,
                    position: "absolute",
                    top: 10,
                    width: "100%",
                    textAlign: "center",
                }}
            >
                Score: <strong>{score}</strong> | High Score:{" "}
                <strong>{highScore}</strong>
            </div>

            {/* THE DOM ELEMENTS ARE GONE, REPLACED BY THIS CANVAS */}
            <canvas
                ref={canvasRef}
                width={GAME_WIDTH}
                height={GAME_HEIGHT}
                style={{ display: "block", background: "transparent" }}
            />

            {!isGameStarted && !isGameOver && (
                <div
                    className="start-screen"
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 10,
                    }}
                >
                    <h2>Flappy Bird</h2>
                    <p>Click anywhere to Start</p>
                </div>
            )}

            {isGameOver && (
                <div
                    className="game-over"
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 10,
                    }}
                >
                    <h2>Game Over</h2>
                    <p>Your Score: {score}</p>
                    <p>High Score: {highScore}</p>

                    <div className="top-score-message">
                        {gameOverMessage && (
                            <p
                                className="hill-top-text"
                                style={{
                                    textAlign: "center",
                                    padding: "0 20px",
                                }}
                            >
                                {gameOverMessage}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevents click from bubbling to the canvas area
                            startGame();
                        }}
                    >
                        Retry
                    </button>
                </div>
            )}
        </div>
    );
};

export default Game;
