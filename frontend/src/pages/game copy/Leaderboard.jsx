// frontend/src/Leaderboard.jsx
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const API_BASE = "/player";

export default function Leaderboard({
    visible,
    onClose,
    lastScore = null,
    playerName = null,
    liveTop = null,
}) {
    const [top, setTop] = useState([]);
    const pollingRef = useRef(null);
    const mountedRef = useRef(false);

    // Fetch top 10 from server
    const fetchTop = async () => {
        try {
            const res = await fetch(`${API_BASE}/top/`);

            if (!res.ok) throw new Error("HTTP error " + res.status);

            const data = await res.json();

            const arr = Array.isArray(data) ? data : data.top || [];
            setTop(arr);
        } catch (err) {
            console.error("Failed to fetch leaderboard", err);
        }
    };

    useEffect(() => {
        if (!visible) {
            // cleanup if modal hidden
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
            return;
        }

        // If a liveTop snapshot is provided, show it immediately
        if (liveTop && Array.isArray(liveTop)) {
            setTop(liveTop.slice(0, 10));
        } else {
            fetchTop();
        }

        // Polling: update every 2 seconds while modal visible.
        pollingRef.current = setInterval(() => {
            if (liveTop && Array.isArray(liveTop)) {
                // if parent supplies live top list, prefer that snapshot
                setTop(liveTop.slice(0, 10));
            } else {
                fetchTop();
            }
        }, 1000);

        mountedRef.current = true;
        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
        };
    }, [visible, liveTop]);

    if (!visible) return null;

    const playerEntry = playerName
        ? top.find((p) => p.name === playerName)
        : null;

    return (
        <ModalOverlay>
            <ModalContent>
                <Header>
                    <h3>Leaderboard — Top 10</h3>
                    <div>
                        <button
                            onClick={fetchTop}
                            style={{ marginRight: 8, marginBottom: 15 }}
                        >
                            Refresh
                        </button>
                        <button onClick={onClose}>Close</button>
                    </div>
                </Header>

                <PlayerInfo>
                    {lastScore !== null && (
                        <div
                            style={{
                                color: "white",
                            }}
                        >
                            Your last run: <strong>{lastScore}</strong>
                        </div>
                    )}
                    {playerEntry ? (
                        <div
                            style={{
                                color: "white",
                            }}
                        >
                            Your best: <strong>{playerEntry.score}</strong>
                        </div>
                    ) : playerName ? (
                        <PlayerNotInTop>
                            {`Player "${playerName}" is not in the top 10.`}
                        </PlayerNotInTop>
                    ) : null}
                </PlayerInfo>

                <ScoreList>
                    {top.length === 0 && (
                        <div style={{ color: "#666" }}>No scores yet.</div>
                    )}
                    {top.map((p, idx) => {
                        const isYou = playerName && p.name === playerName;
                        return (
                            // Pass the 'isYou' boolean as a prop. Prefixed with $ to avoid being passed to the DOM element.
                            <ScoreListItem
                                key={p.id ?? `${p.name}-${idx}`}
                                $isYou={isYou}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 8,
                                        alignItems: "center",
                                    }}
                                >
                                    <Rank>{idx + 1}</Rank>
                                    <Name>{p.name}</Name>
                                </div>
                                <Score>{p.score}</Score>
                            </ScoreListItem>
                        );
                    })}
                </ScoreList>
            </ModalContent>
        </ModalOverlay>
    );
}

const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
`;

const ModalContent = styled.div`
    width: 360px;
    max-height: 80vh;
    overflow-y: auto;
    background: black;
    border-radius: 10px;
    padding: 18px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
        font-size: 18px;
        margin: 0;
    }
`;

const PlayerInfo = styled.div`
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 13px;
    color: #333;
`;

const PlayerNotInTop = styled.div`
    color: #666;
    margin-top: 6px;
`;

const ScoreList = styled.ol`
    padding-left: 18px;
    list-style-type: none; /* ol has default list styles, we often want to reset*/
    margin: 0;
`;

// Use props to conditionally apply styles
const ScoreListItem = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 8px;
    border-radius: 6px;
    margin-bottom: 6px;
    background: ${(props) =>
        props.$isYou
            ? "linear-gradient(90deg, #272525ff, #575654ff)"
            : "transparent"};
    box-shadow: ${(props) =>
        props.$isYou ? "inset 0 0 0 1px rgba(0,0,0,0.04)" : "none"};
`;

const Rank = styled.div`
    width: 32px;
    text-align: center;
    font-weight: 600;
`;

const Name = styled.div`
    min-width: 120px;
`;

const Score = styled.div`
    font-weight: 700;
`;
