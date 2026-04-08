import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function CountdownTimer() {
    // Removed TypeScript interface and generic type annotation
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [mounted, setMounted] = useState(false);

    const targetDate = new Date("2026-05-15T18:00:00+05:30");

    useEffect(() => {
        setMounted(true);

        const calculateTimeLeft = () => {
            const difference = targetDate.getTime() - new Date().getTime();

            if (difference > 0) {
                const totalHours = Math.floor(difference / (1000 * 60 * 60));
                setTimeLeft({
                    hours: totalHours,
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            } else {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!mounted) {
        return null;
    }

    // Formatting numbers to strings
    const hh = (timeLeft.hours % 100).toString().padStart(2, "0");
    const mm = timeLeft.minutes.toString().padStart(2, "0");
    const ss = timeLeft.seconds.toString().padStart(2, "0");

    const chunks = [hh, mm, ss];

    return (
        <div className="relative w-full text-center">
            <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="mx-auto w-full max-w-[620px]"
            >
                <div className="mx-auto rounded-2xl border border-[#7c95ff33] bg-[#070a22]/80 px-3 py-4 backdrop-blur-md shadow-[0_0_48px_rgba(27,58,184,0.2)] sm:px-8 sm:py-5">
                    <p className="font-tech text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85 sm:text-xs sm:tracking-[0.24em]">
                        Coordinator Mission
                    </p>

                    <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5">
                        {chunks.map((chunk, index) => (
                            <div
                                key={`${chunk}-${index}`}
                                className="flex items-center justify-center gap-1.5 sm:gap-2"
                            >
                                <span
                                    className={`font-tech text-[clamp(2.5rem,12vw,5.2rem)] leading-none tracking-[0.05em] ${
                                        index === 0
                                            ? "text-white [text-shadow:0_0_12px_rgba(255,255,255,0.35)]"
                                            : "text-[#4ec4ff] [text-shadow:0_0_14px_rgba(78,196,255,0.65)]"
                                    }`}
                                >
                                    {chunk}
                                </span>
                                {index < chunks.length - 1 && (
                                    <span className="font-tech text-[clamp(1.9rem,8vw,4.2rem)] leading-none text-[#4ec4ff]">
                                        :
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
