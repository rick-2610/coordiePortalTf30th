import React, { useState, useEffect, useMemo } from "react";
import styles from "./navtimer.module.css";
import logo from "../../assets/home/logo.svg";
import smalllogo from "../../assets/home/smalllogo.png";

const Navbar = () => {
    // Set target date: April 12th, 2026 at 5:00 PM
    const targetDate = new Date("April 12, 2026 17:00:00").getTime();

    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            } else {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    // Generate random particles once so they don't re-render and jump every second
    const particles = useMemo(() => {
        return Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            size: `${Math.random() * 4 + 2}px`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 2}s`,
        }));
    }, []);

    // Helper to format numbers with leading zeros
    const formatTime = (time) => (time < 10 ? `0${time}` : time);

    return (
        <div className={styles.navbar}>
            {/* Clickable Logo - Kept intact */}
            <a className={styles.logo} href="https://techfest.org/">
                <img
                    src={logo}
                    className={styles.image}
                    id={styles.image1}
                    alt="Techfest Logo"
                />
                <img
                    src={smalllogo}
                    className={styles.image}
                    id={styles.image2}
                    alt="Techfest Small Logo"
                />
            </a>

            {/* Central Fancy Timer */}
            <div className={styles.timerWrapper}>
                {/* Particle Layer */}
                <div className={styles.particleContainer}>
                    {particles.map((p) => (
                        <div
                            key={p.id}
                            className={styles.particle}
                            style={{
                                left: p.left,
                                top: p.top,
                                width: p.size,
                                height: p.size,
                                animationDuration: p.animationDuration,
                                animationDelay: p.animationDelay,
                            }}
                        ></div>
                    ))}
                </div>

                {/* Glassy Timer Content */}
                <div className={styles.glassTimer}>
                    <div className={styles.timeBlock}>
                        <span className={styles.digits}>
                            {formatTime(timeLeft.days)}
                        </span>
                        <span className={styles.label}>Days</span>
                    </div>
                    <span className={styles.colon}>:</span>
                    <div className={styles.timeBlock}>
                        <span className={styles.digits}>
                            {formatTime(timeLeft.hours)}
                        </span>
                        <span className={styles.label}>Hours</span>
                    </div>
                    <span className={styles.colon}>:</span>
                    <div className={styles.timeBlock}>
                        <span className={styles.digits}>
                            {formatTime(timeLeft.minutes)}
                        </span>
                        <span className={styles.label}>Mins</span>
                    </div>
                    <span className={styles.colon}>:</span>
                    <div className={styles.timeBlock}>
                        <span className={styles.digits}>
                            {formatTime(timeLeft.seconds)}
                        </span>
                        <span className={styles.label}>Secs</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
