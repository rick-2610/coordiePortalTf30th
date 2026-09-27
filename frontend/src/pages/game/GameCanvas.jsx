import React, { useEffect, useRef } from "react";
import { useGameSocket } from "./useGameSocket";

const W = 900,
    HW = 170,
    HD = 48,
    MINE_R = 58;
const FONT = 'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
const SERIF = "Cinzel,Georgia,serif";

const SEATS = [
    { name: "South", cx: 450, cy: 852, ang: 0 },
    { name: "West", cx: 48, cy: 450, ang: Math.PI / 2 },
    { name: "North", cx: 450, cy: 48, ang: Math.PI },
    { name: "East", cx: 852, cy: 450, ang: -Math.PI / 2 },
];
const COLORS = [
    { name: "Blue", c: "#5b93ff", d: "#28498f" },
    { name: "Green", c: "#4fd18b", d: "#1f6f46" },
    { name: "Red", c: "#ff6262", d: "#8f2a2a" },
    { name: "Gold", c: "#ffd23f", d: "#8a6d0c" },
];
const UT = ["knight", "archer", "catapult"];
const TYPES = {
    knight: { label: "Knight", cost: 25 },
    archer: { label: "Archer", cost: 30 },
    catapult: { label: "Catapult", cost: 55 },
};
// Display-only key hints; the server is the one that decides what's affordable.
const KEYS = ["1", "2", "3", "4"];
const CASTLE_HP = 1500;

const hash = (n) => {
    const x = Math.sin(n * 127.1) * 43758.5453;
    return x - Math.floor(x);
};
const tufts = Array.from({ length: 240 }, (_, i) => ({
    x: hash(i) * W,
    y: hash(i + 500) * W,
    s: 2 + hash(i + 900) * 4,
}));
const trees = [];
[
    [130, 130],
    [770, 130],
    [130, 770],
    [770, 770],
].forEach(([cx, cy], k) => {
    for (let i = 0; i < 6; i++)
        trees.push({
            x: cx + (hash(k * 20 + i) - 0.5) * 110,
            y: cy + (hash(k * 20 + i + 7) - 0.5) * 110,
            r: 12 + hash(k * 20 + i + 3) * 10,
        });
});

const BTN = (i) => ({ x: -156 + i * 80, y: 4, w: 72, h: 40 });
const fmtTime = (t) => {
    t = Math.floor(t);
    return Math.floor(t / 60) + ":" + String(t % 60).padStart(2, "0");
};

function toWorld(seat, lx, ly) {
    const c = Math.cos(seat.ang),
        n = Math.sin(seat.ang);
    return { x: seat.cx + lx * c - ly * n, y: seat.cy + lx * n + ly * c };
}
function toLocal(seat, x, y) {
    const dx = x - seat.cx,
        dy = y - seat.cy,
        c = Math.cos(seat.ang),
        n = Math.sin(seat.ang);
    return { x: dx * c + dy * n, y: -dx * n + dy * c };
}
function rrect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

export function GameCanvas({ code }) {
    const canvasRef = useRef(null);
    const scaleRef = useRef(1);
    const {
        connected,
        mySeat,
        hostSeat,
        lobbyPlayers,
        phase,
        state,
        startGame,
        spawn,
        cycleTarget,
    } = useGameSocket(code);
    const stateRef = useRef(state);
    stateRef.current = state;
    const mySeatRef = useRef(mySeat);
    mySeatRef.current = mySeat;

    // ---- canvas resize ----
    useEffect(() => {
        const canvas = canvasRef.current;
        function fit() {
            const r = canvas.getBoundingClientRect(),
                dpr = window.devicePixelRatio || 1;
            canvas.width = Math.max(300, Math.round(r.width * dpr));
            canvas.height = canvas.width;
            scaleRef.current = canvas.width / W;
        }
        const ro = new ResizeObserver(fit);
        ro.observe(canvas);
        fit();
        return () => ro.disconnect();
    }, []);

    // ---- render loop: purely draws the latest server snapshot, never simulates ----
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let raf;
        function frame() {
            draw(ctx, scaleRef.current, stateRef.current, mySeatRef.current);
            raf = requestAnimationFrame(frame);
        }
        raf = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(raf);
    }, []);

    // ---- keyboard input: 1/2/3 spawn, 4 cycles target - always acts on MY seat only ----
    useEffect(() => {
        function onKey(e) {
            if (phase !== "playing") return;
            const i = KEYS.indexOf(e.key);
            if (i === -1) return;
            e.preventDefault();
            if (i < 3) spawn(UT[i]);
            else if (!e.repeat) cycleTarget();
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [phase, spawn, cycleTarget]);

    // ---- click on my own keep's buttons ----
    useEffect(() => {
        const canvas = canvasRef.current;
        function onDown(e) {
            if (phase !== "playing" || mySeat == null || !stateRef.current)
                return;
            const r = canvas.getBoundingClientRect();
            const x = ((e.clientX - r.left) * W) / r.width,
                y = ((e.clientY - r.top) * W) / r.height;
            const seat = SEATS[mySeat];
            const l = toLocal(seat, x, y);
            for (let i = 0; i < 4; i++) {
                const b = BTN(i);
                if (
                    l.x >= b.x &&
                    l.x <= b.x + b.w &&
                    l.y >= b.y &&
                    l.y <= b.y + b.h
                ) {
                    if (i < 3) spawn(UT[i]);
                    else cycleTarget();
                    return;
                }
            }
        }
        canvas.addEventListener("pointerdown", onDown);
        return () => canvas.removeEventListener("pointerdown", onDown);
    }, [phase, mySeat, spawn, cycleTarget]);

    if (phase === "lobby") {
        return (
            <LobbyView
                code={code}
                connected={connected}
                mySeat={mySeat}
                hostSeat={hostSeat}
                players={lobbyPlayers}
                onStart={startGame}
            />
        );
    }

    return (
        <div
            style={{
                position: "relative",
                width: "min(97vw,97vh)",
                aspectRatio: 1,
                margin: "0 auto",
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    borderRadius: 10,
                    background: "#3f6b33",
                }}
            />
            {phase === "over" && state && (
                <GameOverOverlay state={state} mySeat={mySeat} />
            )}
        </div>
    );
}

function LobbyView({ code, connected, mySeat, hostSeat, players, onStart }) {
    const bySeat = new Map(players.map((p) => [p.seat, p]));
    return (
        <div
            style={{
                maxWidth: 420,
                margin: "60px auto",
                fontFamily: FONT,
                textAlign: "center",
            }}
        >
            <h1>Lobby {code}</h1>
            <p>
                {connected ? "Connected" : "Connecting…"} — share this code with
                1-3 friends.
            </p>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {SEATS.map((s, i) => {
                    const p = bySeat.get(i);
                    return (
                        <li
                            key={i}
                            style={{
                                display: "flex",
                                gap: 8,
                                alignItems: "center",
                                padding: "6px 0",
                                borderTop: "1px solid #ddd",
                            }}
                        >
                            <span
                                style={{
                                    width: 14,
                                    height: 14,
                                    borderRadius: "50%",
                                    background: COLORS[i].c,
                                    display: "inline-block",
                                }}
                            />
                            <b style={{ width: 70, textAlign: "left" }}>
                                {s.name}
                            </b>
                            <span>
                                {p ? p.name : "empty"}
                                {p && !p.connected ? " (disconnected)" : ""}
                                {i === hostSeat ? " — host" : ""}
                            </span>
                        </li>
                    );
                })}
            </ul>
            {mySeat === hostSeat ? (
                <button
                    onClick={onStart}
                    disabled={players.length < 2}
                    style={{
                        font: "inherit",
                        fontWeight: 700,
                        padding: "10px 18px",
                        borderRadius: 9,
                        border: 0,
                        cursor: "pointer",
                        background: "#8a6a12",
                        color: "#fff",
                    }}
                >
                    Start battle {players.length < 2 ? "(need 2+ players)" : ""}
                </button>
            ) : (
                <p>Waiting for the host to start…</p>
            )}
        </div>
    );
}

function GameOverOverlay({ state, mySeat }) {
    const winner = state.players.find((p) => p.seat === state.winner);
    const iWon = state.winner === mySeat;
    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(8,12,15,.7)",
                borderRadius: 10,
            }}
        >
            <div
                style={{
                    background: "#182027",
                    color: "#e6ebee",
                    padding: 24,
                    borderRadius: 12,
                    textAlign: "center",
                    fontFamily: FONT,
                }}
            >
                <h2
                    style={{
                        fontFamily: SERIF,
                        color: winner ? COLORS[winner.seat].c : "#fff",
                    }}
                >
                    {winner ? winner.name : "Someone"} wins
                    {iWon ? " — that was you!" : ""}
                </h2>
                <p>The last keep standing after {fmtTime(state.time)}.</p>
            </div>
        </div>
    );
}

// =================== drawing (pure function of server state) ===================
function draw(ctx, scale, state, mySeat) {
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, W, W);
    if (!state) return;

    ctx.save();
    if (mySeat != null) {
        // Rotate the camera so MY seat always renders at the bottom, facing
        // "up" toward the board, same as sitting at a physical table. Every
        // other seat rotates around me exactly the way it would in real life.
        ctx.translate(450, 450);
        ctx.rotate(-SEATS[mySeat].ang);
        ctx.translate(-450, -450);
    }

    drawBoard(ctx);
    drawMine(ctx, state);
    drawTargetLines(ctx, state);
    for (const p of state.players) drawKeep(ctx, p, state, mySeat);
    for (const u of state.units) drawUnit(ctx, u);
    for (const pr of state.proj) {
        const x = pr.sx + (pr.tx - pr.sx) * pr.t,
            y = pr.sy + (pr.ty - pr.sy) * pr.t,
            h = Math.sin(Math.PI * pr.t) * 42;
        ctx.fillStyle = "rgba(0,0,0,.3)";
        ctx.beginPath();
        ctx.ellipse(x, y, 4, 2.5, 0, 0, 7);
        ctx.fill();
        ctx.fillStyle = "#2a2620";
        ctx.beginPath();
        ctx.arc(x, y - h, 4.5, 0, 7);
        ctx.fill();
    }
    ctx.restore();

    // HUD text drawn AFTER restoring the camera rotation so it's always upright
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = `700 15px ${FONT}`;
    ctx.fillStyle = "rgba(255,255,255,.8)";
    ctx.fillText(fmtTime(state.time), 14, 20);
    ctx.textAlign = "center";
    ctx.font = `800 15px ${FONT}`;
    (state.banners || []).forEach((b, i) => {
        ctx.globalAlpha = Math.min(1, b.t);
        ctx.fillStyle = "rgba(0,0,0,.55)";
        const w = ctx.measureText(b.text).width + 24;
        rrect(ctx, 450 - w / 2, 16 + i * 28, w, 22, 6);
        ctx.fill();
        ctx.fillStyle = COLORS[b.colorSeat] ? COLORS[b.colorSeat].c : "#fff";
        ctx.fillText(b.text, 450, 27 + i * 28);
    });
    ctx.globalAlpha = 1;
}

function drawBoard(ctx) {
    const gr = ctx.createRadialGradient(450, 450, 60, 450, 450, 650);
    gr.addColorStop(0, "#4e7d3c");
    gr.addColorStop(1, "#375c2b");
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, W, W);
    ctx.fillStyle = "rgba(190,165,105,.30)";
    ctx.fillRect(0, 415, W, 70);
    ctx.fillRect(415, 0, 70, W);
    ctx.strokeStyle = "rgba(20,50,15,.5)";
    ctx.lineWidth = 1.2;
    for (const t of tufts) {
        ctx.beginPath();
        ctx.moveTo(t.x, t.y);
        ctx.lineTo(t.x - 1, t.y - t.s);
        ctx.moveTo(t.x, t.y);
        ctx.lineTo(t.x + 2, t.y - t.s * 0.8);
        ctx.stroke();
    }
    for (const t of trees) {
        ctx.fillStyle = "rgba(0,0,0,.22)";
        ctx.beginPath();
        ctx.arc(t.x + 4, t.y + 5, t.r, 0, 7);
        ctx.fill();
        ctx.fillStyle = "#2b5a27";
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r, 0, 7);
        ctx.fill();
        ctx.fillStyle = "#3b7332";
        ctx.beginPath();
        ctx.arc(t.x - t.r * 0.25, t.y - t.r * 0.25, t.r * 0.6, 0, 7);
        ctx.fill();
    }
}
function drawMine(ctx, state) {
    const o = state.mineOwner;
    ctx.save();
    ctx.translate(450, 450);
    const gl = ctx.createRadialGradient(0, 0, 8, 0, 0, MINE_R + 16);
    gl.addColorStop(0, "rgba(255,214,90,.55)");
    gl.addColorStop(1, "rgba(255,214,90,0)");
    ctx.fillStyle = gl;
    ctx.beginPath();
    ctx.arc(0, 0, MINE_R + 16 + Math.sin(state.time * 2) * 3, 0, 7);
    ctx.fill();
    ctx.fillStyle = "#5b4a2c";
    ctx.beginPath();
    ctx.arc(0, 0, MINE_R, 0, 7);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = o >= 0 ? COLORS[o].c : "rgba(255,220,120,.55)";
    ctx.setLineDash(o >= 0 ? [] : [8, 7]);
    ctx.stroke();
    ctx.setLineDash([]);
    for (let i = 0; i < 9; i++) {
        const a = hash(i) * 6.28,
            d = 8 + hash(i + 9) * 36;
        ctx.fillStyle = i % 2 ? "#f5c542" : "#ffdf75";
        ctx.beginPath();
        ctx.arc(Math.cos(a) * d, Math.sin(a) * d, 4 + hash(i + 3) * 4, 0, 7);
        ctx.fill();
    }
    ctx.fillStyle = "rgba(255,255,255,.85)";
    ctx.font = `800 20px ${SERIF}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("MINE", 0, -2);
    ctx.font = `700 11px ${FONT}`;
    ctx.fillStyle = o >= 0 ? COLORS[o].c : "rgba(255,255,255,.7)";
    ctx.fillText(o >= 0 ? `${COLORS[o].name} +4/s` : "most units wins", 0, 15);
    ctx.restore();
}
function drawTargetLines(ctx, state) {
    ctx.save();
    ctx.setLineDash([6, 9]);
    ctx.lineWidth = 2;
    const bySeat = new Map(state.players.map((p) => [p.seat, p]));
    for (const p of state.players) {
        if (!p.alive) continue;
        const t = bySeat.get(p.target);
        if (!t || !t.alive || t === p) continue;
        const a = toWorld(SEATS[p.seat], 0, -HD - 4),
            b = toWorld(SEATS[t.seat], 0, -HD - 4);
        ctx.strokeStyle = COLORS[p.seat].c;
        ctx.globalAlpha = 0.28;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
    }
    ctx.restore();
}
function drawKeep(ctx, p, state, mySeat) {
    const seat = SEATS[p.seat],
        col = COLORS[p.seat],
        isMine = p.seat === mySeat;
    ctx.save();
    ctx.translate(seat.cx, seat.cy);
    ctx.rotate(seat.ang);
    if (!p.alive) {
        ctx.fillStyle = "#4a4338";
        ctx.fillRect(-HW, -HD, 2 * HW, 2 * HD);
        ctx.fillStyle = "rgba(255,255,255,.6)";
        ctx.font = `800 17px ${SERIF}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.name + "'s keep has fallen", 0, 0);
        ctx.restore();
        return;
    }
    ctx.fillStyle = "rgba(0,0,0,.32)";
    ctx.fillRect(-HW + 5, -HD + 7, 2 * HW, 2 * HD);
    const gr = ctx.createLinearGradient(0, -HD, 0, HD);
    gr.addColorStop(0, "#9c9481");
    gr.addColorStop(1, "#6b6455");
    ctx.fillStyle = gr;
    ctx.fillRect(-HW, -HD, 2 * HW, 2 * HD);
    ctx.strokeStyle = "rgba(0,0,0,.13)";
    ctx.lineWidth = 1;
    for (let y = -HD + 16; y < HD; y += 16) {
        ctx.beginPath();
        ctx.moveTo(-HW, y);
        ctx.lineTo(HW, y);
        ctx.stroke();
    }
    ctx.fillStyle = col.c;
    ctx.fillRect(-HW, -HD, 2 * HW, 5);
    ctx.fillStyle = "#7f7765";
    ctx.fillRect(-HW - 14, -HD - 8, 26, 2 * HD + 16);
    ctx.fillRect(HW - 12, -HD - 8, 26, 2 * HD + 16);
    ctx.fillStyle = col.d;
    ctx.fillRect(-HW - 14, -HD - 8, 26, 7);
    ctx.fillRect(HW - 12, -HD - 8, 26, 7);
    if (p.flash > 0) {
        ctx.fillStyle = `rgba(255,255,255,${Math.min(0.5, p.flash * 4)})`;
        ctx.fillRect(-HW, -HD, 2 * HW, 2 * HD);
    }
    if (isMine) {
        ctx.strokeStyle = "rgba(255,255,255,.85)";
        ctx.lineWidth = 3;
        ctx.strokeRect(-HW, -HD, 2 * HW, 2 * HD);
    }

    const ratio = p.hp / CASTLE_HP;
    ctx.fillStyle = "rgba(10,8,5,.75)";
    rrect(ctx, -150, -37, 300, 13, 4);
    ctx.fill();
    ctx.fillStyle = ratio < 0.25 ? "#ff5a3c" : col.c;
    rrect(ctx, -150, -37, Math.max(4, 300 * ratio), 13, 4);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = `700 10px ${FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(Math.ceil(p.hp) + " / " + CASTLE_HP, 0, -30);

    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#f5c542";
    ctx.beginPath();
    ctx.arc(-143, -11, 6, 0, 7);
    ctx.fill();
    ctx.strokeStyle = "#8a6d0c";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.font = `800 15px ${FONT}`;
    ctx.fillText(String(Math.floor(p.gold)), -131, -10);
    ctx.fillStyle = "rgba(255,255,255,.75)";
    ctx.font = `600 11px ${FONT}`;
    ctx.fillText("+" + p.income.toFixed(0) + "/s", -92, -9);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = `800 14px ${SERIF}`;
    ctx.fillText((state.leader === p.seat ? "\u265B " : "") + p.name, 150, -10);

    // buttons: only rendered "live"/clickable for the local player's own keep
    for (let i = 0; i < 4; i++) {
        const b = BTN(i),
            isT = i === 3,
            type = UT[i];
        ctx.globalAlpha = isMine ? 1 : 0.5;
        ctx.fillStyle = "rgba(18,14,9,.88)";
        rrect(ctx, b.x, b.y, b.w, b.h, 6);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = col.c;
        ctx.stroke();
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff";
        ctx.font = `800 12px ${FONT}`;
        ctx.fillText(
            isT ? "Target" : TYPES[type].label,
            b.x + b.w / 2,
            b.y + 13,
        );
        ctx.font = `700 11px ${FONT}`;
        ctx.textAlign = "left";
        if (isT) {
            const targetName =
                state.players.find((q) => q.seat === p.target)?.name || "?";
            ctx.fillStyle = COLORS[p.target] ? COLORS[p.target].c : "#fff";
            ctx.fillText(targetName, b.x + 7, b.y + 30);
        } else {
            ctx.fillStyle = "#fff";
            ctx.fillText(TYPES[type].cost + "g", b.x + 7, b.y + 30);
        }
        if (isMine) {
            ctx.textAlign = "right";
            ctx.fillStyle = "rgba(255,255,255,.65)";
            ctx.font = `700 10px ui-monospace,Menlo,monospace`;
            ctx.fillText(KEYS[i], b.x + b.w - 6, b.y + 30);
        }
        ctx.globalAlpha = 1;
    }
    ctx.restore();
}
function drawUnit(ctx, u) {
    const col = COLORS[u.owner],
        r = { knight: 7, archer: 6, catapult: 9 }[u.type];
    ctx.save();
    ctx.translate(u.x, u.y);
    ctx.fillStyle = "rgba(0,0,0,.25)";
    ctx.beginPath();
    ctx.ellipse(1.5, 2.5, r, r * 0.7, 0, 0, 7);
    ctx.fill();
    ctx.rotate(u.face);
    if (u.type === "knight") {
        ctx.strokeStyle = "#e8e8e8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(r * 0.4, 0);
        ctx.lineTo(r + 6, 0);
        ctx.stroke();
        ctx.fillStyle = col.c;
        ctx.strokeStyle = "#15110b";
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, 7);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = col.d;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.5, 0, 7);
        ctx.fill();
    } else if (u.type === "archer") {
        ctx.fillStyle = col.c;
        ctx.strokeStyle = "#15110b";
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(r + 2, 0);
        ctx.lineTo(-r, r * 0.9);
        ctx.lineTo(-r * 0.5, 0);
        ctx.lineTo(-r, -r * 0.9);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    } else {
        ctx.fillStyle = col.d;
        ctx.strokeStyle = col.c;
        ctx.lineWidth = 2;
        rrect(ctx, -r, -r * 0.75, r * 2, r * 1.5, 3);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = "#e0d2a8";
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(-r * 0.4, 0);
        ctx.lineTo(r + 3, 0);
        ctx.stroke();
    }
    ctx.restore();
    if (u.hp < u.maxHp) {
        ctx.fillStyle = "rgba(0,0,0,.6)";
        ctx.fillRect(u.x - 9, u.y - r - 7, 18, 3);
        ctx.fillStyle = u.hp / u.maxHp > 0.4 ? "#7be07b" : "#ff6a4a";
        ctx.fillRect(u.x - 9, u.y - r - 7, (18 * u.hp) / u.maxHp, 3);
    }
}
