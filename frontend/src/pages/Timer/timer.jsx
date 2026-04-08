import { motion } from "framer-motion";
import { CountdownTimer } from "./countdown-timer";

const stars = Array.from({ length: 18 }, (_, index) => ({
    top: `${8 + ((index * 7) % 82)}%`,
    left: `${6 + ((index * 11) % 86)}%`,
    size: `${index % 3 === 0 ? 3 : 2}px`,
    delay: (index % 6) * 0.2,
}));

export default function Timer() {
    return (
        <section className="relative flex min-h-screen items-center overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-12">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/moon-hero-new.jpg')" }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(9,21,49,0.68)_0%,rgba(4,10,25,0.85)_46%,rgba(1,4,11,0.95)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px)] bg-[size:54px_54px] sm:bg-[size:72px_72px] opacity-25" />

            {stars.map((star, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0.2, scale: 0.85 }}
                    animate={{
                        opacity: [0.25, 1, 0.25],
                        scale: [0.85, 1.2, 0.85],
                    }}
                    transition={{
                        duration: 4 + (index % 3),
                        repeat: Infinity,
                        delay: star.delay,
                    }}
                    className="absolute rounded-full bg-white"
                    style={{
                        top: star.top,
                        left: star.left,
                        width: star.size,
                        height: star.size,
                    }}
                />
            ))}

            <motion.div
                aria-hidden="true"
                className="absolute -left-24 top-20 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl sm:h-72 sm:w-72"
                animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                aria-hidden="true"
                className="absolute -right-24 bottom-4 h-56 w-56 rounded-full bg-fuchsia-500/15 blur-3xl sm:h-80 sm:w-80"
                animate={{ x: [0, -16, 0], y: [0, 16, 0] }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.05 }}
                    className="font-tech max-w-4xl text-center text-[clamp(2rem,7vw,5.2rem)] font-semibold leading-[1.05] tracking-tight text-white"
                >
                    Your Techfest Journey Starts Here
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="font-tech mt-4 max-w-2xl px-2 text-center text-[clamp(0.95rem,2.9vw,1.2rem)] leading-6 text-white/80 sm:mt-5"
                >
                    Step into the engine room of Asia's largest Science &
                    Technology festival
                </motion.p>

                <div className="mt-9 flex w-full justify-center sm:mt-12">
                    <CountdownTimer />
                </div>

                <motion.a
                    href="/coordinator-registration.html"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="font-tech mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 px-6 py-3.5 text-xs font-semibold tracking-[0.17em] text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-transform sm:mt-10 sm:px-8 sm:py-4 sm:text-sm sm:tracking-[0.2em]"
                >
                    Test Your Reflexes
                </motion.a>
            </div>
        </section>
    );
}
