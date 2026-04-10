import React, { useState, useEffect, useRef, useMemo } from "react";

export default function Home() {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 480);

    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth < 480);
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [entryProgress, setEntryProgress] = useState(0);
    const [exitProgress, setExitProgress] = useState(0);
    const [scrollY, setScrollY] = useState(0);
    const orbitalContainerRef = useRef(null);

    // Holographic Carousel State
    const [holoIndex, setHoloIndex] = useState(0);
    const [isHoloFlickering, setIsHoloFlickering] = useState(false);
    const holoImages = [
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    ];

    // Carousel Timing Logic: 2 seconds wait + fast 2-flicker transition
    useEffect(() => {
        const carouselInterval = setInterval(() => {
            // Trigger flicker animation
            setIsHoloFlickering(true);

            // Change image halfway through the glitch animation (after 1st flicker)
            setTimeout(() => {
                setHoloIndex((prev) => (prev + 1) % holoImages.length);
            }, 200);

            // Stop flickering after 400ms (completes 2 flickers)
            setTimeout(() => {
                setIsHoloFlickering(false);
            }, 400);
        }, 2400); // 2000ms display + 400ms transition

        return () => clearInterval(carouselInterval);
    }, [holoImages.length]);

    // Generate random interactive stars that stay fixed on re-renders
    const interactiveStars = useMemo(() => {
        return Array.from({ length: 300 }).map(() => ({
            id: Math.random().toString(36).substring(2, 9),
            top: `${Math.random() * 140 - 20}%`,
            left: `${Math.random() * 100}%`,
            size: `${Math.random() * 3 + 1}px`,
            opacity: Math.random() * 0.7 + 0.3,
            hx: `${(Math.random() - 0.5) * 250}px`,
            hy: `${(Math.random() - 0.5) * 250}px`,
            floatDur: `${Math.random() * 10 + 10}s`,
            floatDelay: `-${Math.random() * 20}s`,
            tx1: `${(Math.random() - 0.5) * 60}px`,
            ty1: `${(Math.random() - 0.5) * 60}px`,
            tx2: `${(Math.random() - 0.5) * 60}px`,
            ty2: `${(Math.random() - 0.5) * 60}px`,
            entryDelay: Math.random() * 0.7,
            entryY:
                (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 800 + 500),
        }));
    }, []);

    // Track the scroll progress specifically within the orbital container
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);

            if (!orbitalContainerRef.current) return;

            const rect = orbitalContainerRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            let eProgress = 1 - rect.top / viewportHeight;
            setEntryProgress(Math.max(0, Math.min(1, eProgress)));

            const totalScrollableDistance = rect.height - viewportHeight;
            let progress = -rect.top / totalScrollableDistance;

            progress = Math.max(0, Math.min(1, progress));
            setScrollProgress(progress);

            let exProgress = (rect.bottom - viewportHeight) / viewportHeight;
            setExitProgress(Math.max(0, Math.min(1, -exProgress)));
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Initialize Particles.js for the Hero Section
    useEffect(() => {
        const initParticles = () => {
            if (window.particlesJS) {
                window.particlesJS("particles-hero", {
                    particles: {
                        number: {
                            value: 150,
                            density: { enable: true, value_area: 1600 },
                        },
                        color: { value: "#818cf8" },
                        shape: { type: "circle" },
                        opacity: { value: 0.6, random: true },
                        size: { value: 3, random: true },
                        line_linked: {
                            enable: true,
                            distance: 130,
                            color: "#818cf8",
                            opacity: 0.4,
                            width: 1,
                        },
                        move: {
                            enable: true,
                            speed: 2,
                            direction: "none",
                            random: true,
                            straight: false,
                            out_mode: "out",
                            bounce: false,
                        },
                    },
                    interactivity: {
                        detect_on: "canvas",
                        events: {
                            onhover: { enable: true, mode: "grab" },
                            onclick: { enable: true, mode: "push" },
                            resize: true,
                        },
                        modes: {
                            grab: {
                                distance: 200,
                                line_linked: { opacity: 0.8 },
                            },
                            push: { particles_nb: 4 },
                        },
                    },
                    retina_detect: true,
                });
            }
        };

        if (!window.particlesJS) {
            const script = document.createElement("script");
            script.src =
                "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
            script.id = "particles-js-script";
            script.async = true;
            script.onload = initParticles;
            document.body.appendChild(script);
        } else {
            initParticles();
        }
    }, []);

    // Helper to calculate the 3D orbit position for each card
    const getCardStyle = (globalProgress, startOffset, endOffset) => {
        let p = (globalProgress - startOffset) / (endOffset - startOffset);
        const pCenter = p - 0.5;
        const angle = pCenter * Math.PI;

        const xPos = -Math.sin(angle) * 65;
        const zPos = (Math.cos(angle) - 1) * 800;
        const yPos = Math.cos(angle) * 120;

        const rotY = pCenter * 130;
        const rotZ = pCenter * -15;

        const opacity = Math.max(0, 1 - Math.pow(Math.abs(pCenter) * 1.8, 4));

        return {
            transform: `translate(-50%, -50%) translate3d(${xPos}vw, ${yPos}px, ${zPos}px) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`,
            opacity: opacity,
            zIndex: 20,
            position: "absolute",
            top: "50%",
            left: "50%",
            transformStyle: "preserve-3d",
            visibility: opacity > 0 ? "visible" : "hidden",
        };
    };

    const sunProgress = Math.max(0, (entryProgress - 0.4) / 0.6);
    const easeOutBack = (x) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    };

    const sunScale =
        sunProgress === 0 ? 0 : Math.max(0, easeOutBack(sunProgress));
    const sunYOffset = Math.pow(1 - sunProgress, 3) * 200;

    const heroOpacity = Math.max(0, 1 - scrollY / 600);
    const heroYOffset = scrollY * 0.3;
    const finalSunOpacity = Math.min(1, sunProgress * 2) * (1 - exitProgress);
    const finalSunScale = sunScale * (1 - exitProgress * 0.5);

    return (
        <div className="bg-slate-950 text-white min-h-screen font-sans relative selection:bg-indigo-500/30 overflow-clip">
            <style>{`
                @keyframes spin-slow {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                @keyframes spin-slow-reverse {
                  from { transform: rotate(360deg); }
                  to { transform: rotate(0deg); }
                }
                .glass-panel {
                  background: rgba(255, 255, 255, 0.03);
                  backdrop-filter: blur(16px);
                  -webkit-backdrop-filter: blur(16px);
                  border: 1px solid rgba(255, 255, 255, 0.1);
                  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                }
                .star-pattern {
                  background-image: radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px);
                  background-size: 40px 40px;
                }
                @keyframes ambient-float {
                  0%, 100% { transform: translate(calc(-50% + var(--tx1)), calc(-50% + var(--ty1))); }
                  50% { transform: translate(calc(-50% + var(--tx2)), calc(-50% + var(--ty2))); }
                }
                .star-wrapper {
                  position: absolute;
                  width: 60px;
                  height: 60px;
                  z-index: 1;
                  animation: ambient-float var(--float-dur) ease-in-out var(--float-delay) infinite;
                  pointer-events: auto;
                }
                .interactive-star {
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  background-color: white;
                  border-radius: 50%;
                  transition: transform 2.5s cubic-bezier(0.19, 1, 0.22, 1), background-color 1s, opacity 1s, box-shadow 1s;
                }
                .star-wrapper:hover {
                  z-index: 2;
                }
                .star-wrapper:hover .interactive-star {
                  transform: translate(calc(-50% + var(--hx)), calc(-50% + var(--hy))) scale(2.5);
                  background-color: #818cf8;
                  box-shadow: 0 0 15px #818cf8;
                  opacity: 1 !important;
                }

                /* HOLOGRAPHIC CAROUSEL CSS */
                .holo-container {
                  perspective: 1200px;
                  transform-style: preserve-3d;
                }
                .holo-3d-tilt {
                  /* Perspective from right to left going inside the z-axis */
                  transform: rotateY(-30deg) translateZ(-50px);
                  transform-style: preserve-3d;
                  transform-origin: right center;
                }
                .holo-scanlines {
                  position: absolute;
                  inset: 0;
                  background: linear-gradient(to bottom, transparent 50%, rgba(0, 255, 255, 0.15) 51%);
                  background-size: 100% 4px;
                  pointer-events: none;
                  z-index: 10;
                }
                .holo-idle-float {
                  animation: holo-float 4s ease-in-out infinite, holo-pulse 3s infinite alternate;
                }
                .holo-flicker-anim {
                  /* Exactly 2 flickers visually simulated within 400ms */
                  animation: holo-glitch 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                }
                @keyframes holo-float {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-12px); }
                }
                @keyframes holo-pulse {
                  0% { box-shadow: inset 0 0 15px rgba(0,255,255,0.3), 0 0 20px rgba(0,255,255,0.2); }
                  100% { box-shadow: inset 0 0 35px rgba(0,255,255,0.6), 0 0 40px rgba(0,255,255,0.5); }
                }
                @keyframes holo-glitch {
                  0% { opacity: 1; transform: translateX(0) skewX(0); filter: hue-rotate(0deg) brightness(1); }
                  20% { opacity: 0.2; transform: translateX(-5px) skewX(10deg); filter: hue-rotate(-30deg) brightness(2); }
                  40% { opacity: 0.9; transform: translateX(5px) skewX(-10deg); filter: hue-rotate(30deg) brightness(1.5); }
                  60% { opacity: 0.1; transform: translateX(-2px) skewX(5deg); filter: hue-rotate(0deg) brightness(3); }
                  80% { opacity: 1; transform: translateX(2px) skewX(-5deg); }
                  100% { opacity: 1; transform: translateX(0) skewX(0); filter: hue-rotate(0deg) brightness(1); }
                }
                .holo-projector-base {
                  position: absolute;
                  bottom: -40px;
                  left: 60%;
                  transform: translateX(-50%) rotateX(75deg);
                  width: 180px;
                  height: 180px;
                  background: radial-gradient(circle, rgba(0,255,255,0.7) 0%, transparent 60%);
                  filter: blur(8px);
                  opacity: 0.7;
                  pointer-events: none;
                }
            `}</style>

            <div className="fixed inset-0 pointer-events-none star-pattern z-0 opacity-50"></div>

            <div
                className="fixed inset-0 z-0 pointer-events-none"
                style={{
                    transform: `translateY(${scrollY * -0.15}px)`,
                    willChange: "transform",
                }}
            >
                {interactiveStars.map((star) => (
                    <div
                        key={star.id}
                        className="absolute"
                        style={{ top: star.top, left: star.left }}
                    >
                        <div
                            className="star-wrapper"
                            style={{
                                "--hx": star.hx,
                                "--hy": star.hy,
                                "--float-dur": star.floatDur,
                                "--float-delay": star.floatDelay,
                                "--tx1": star.tx1,
                                "--ty1": star.ty1,
                                "--tx2": star.tx2,
                                "--ty2": star.ty2,
                            }}
                        >
                            <div
                                className="interactive-star"
                                style={{
                                    width: star.size,
                                    height: star.size,
                                    opacity: star.opacity,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* ================= HERO SECTION ================= */}
            <section className="relative min-h-screen py-32 md:py-0 md:min-h-screen w-full flex items-center px-6 sm:px-8 md:px-24 z-10 overflow-hidden pointer-events-none">
                <div
                    id="particles-hero"
                    className="absolute inset-0 z-0 pointer-events-auto"
                    style={{ opacity: heroOpacity, willChange: "opacity" }}
                ></div>

                {!isMobile ? (
                    <div className="flex md:flex-row w-full items-center justify-between pointer-events-auto relative z-20 max-w-7xl mx-auto gap-12">
                        {/* Left Side: Original Hero Text */}
                        <div
                            className="flex flex-col items-center text-center md:items-start md:text-left w-full md:w-1/2 max-w-2xl"
                            style={{
                                opacity: heroOpacity,
                                transform: `translateY(${heroYOffset}px)`,
                                willChange: "opacity, transform",
                            }}
                        >
                            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-black leading-tight mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-500">
                                Welcome to <br /> Techfest
                            </h1>
                            <p className="text-slate-400 max-w-lg text-sm sm:text-base md:text-lg mb-8">
                                Techfest IIT Bombay is a transformative
                                experience and Asia's largest science and tech
                                festival. It's your chance to hone skills,
                                network with industry leaders, and gain global
                                exposure. Meet peers and professionals from
                                around the world, enjoy Ozone activities, and
                                witness electrifying TechX performances. Whether
                                you're passionate about tech, innovation, or
                                making connections, Techfest opens doors to
                                endless possibilities. Join us and be part of
                                something extraordinary!
                            </p>
                        </div>

                        {/* Right Side: Holographic Carousel Container */}
                        <div
                            className="holo-container w-full md:w-1/2 max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto mt-16 md:mt-0 flex-shrink-0"
                            style={{
                                opacity: heroOpacity,
                                transform: `translateY(${heroYOffset * 1.1}px)`,
                                willChange: "opacity, transform",
                                minHeight: "300px", // Increased height
                            }}
                        >
                            {/* Replaced 'aspect-video' with hardcoded heights and aspect-ratio inline style to prevent 0px height collapse */}
                            <div className="holo-3d-tilt relative w-full h-48 sm:h-56 md:h-64 lg:h-72">
                                <div
                                    className={`absolute inset-0 rounded-xl border border-cyan-400/60 bg-cyan-950/80 overflow-hidden ${isHoloFlickering ? "holo-flicker-anim" : "holo-idle-float"}`}
                                >
                                    {/* Image with filters applied to simulate a projected blue hologram */}
                                    <img
                                        src={holoImages[holoIndex]}
                                        alt="Techfest Holographic Display"
                                        className="w-full h-full object-cover opacity-80 mix-blend-screen filter sepia hue-rotate-180 saturate-200 contrast-125"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                        }}
                                    />
                                    {/* Blue glowing overlay mask */}
                                    <div className="absolute inset-0 bg-cyan-400/20 mix-blend-color"></div>
                                    <div className="holo-scanlines"></div>
                                </div>
                            </div>
                            {/* The glowing projector source on the floor */}
                            <div className="holo-projector-base"></div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row w-full items-center justify-between pointer-events-auto relative z-20 max-w-7xl mx-auto gap-12">
                        {/* Left Side: Original Hero Text */}
                        <div
                            className="flex flex-col items-center text-center md:items-start md:text-left w-full md:w-1/2 max-w-2xl"
                            style={{
                                opacity: heroOpacity,
                                transform: `translateY(${heroYOffset}px)`,
                                willChange: "opacity, transform",
                            }}
                        >
                            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-black leading-tight mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-500">
                                Welcome to <br /> Techfest
                            </h1>
                            <p className="text-slate-400 max-w-lg text-sm sm:text-base md:text-lg mb-8">
                                Techfest IIT Bombay is a transformative
                                experience and Asia's largest science and tech
                                festival. It's your chance to hone skills,
                                network with industry leaders, and gain global
                                exposure. Meet peers and professionals from
                                around the world, enjoy Ozone activities, and
                                witness electrifying TechX performances. Whether
                                you're passionate about tech, innovation, or
                                making connections, Techfest opens doors to
                                endless possibilities. Join us and be part of
                                something extraordinary!
                            </p>
                        </div>

                        {/* Right Side: Holographic Carousel Container */}
                        <div
                            className="holo-container w-full md:w-1/2 max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto mt-16 md:mt-0 flex-shrink-0"
                            style={{
                                opacity: heroOpacity,
                                transform: `translateY(${heroYOffset * 1.1}px)`,
                                willChange: "opacity, transform",
                            }}
                        >
                            {/* Replaced 'aspect-video' with hardcoded heights and aspect-ratio inline style to prevent 0px height collapse */}
                            <div
                                className="holo-3d-tilt relative w-full h-48 sm:h-56 md:h-64 lg:h-72"
                                style={{ aspectRatio: "16/9" }}
                            >
                                <div
                                    className={`absolute inset-0 rounded-xl border border-cyan-400/60 bg-cyan-950/80 overflow-hidden ${isHoloFlickering ? "holo-flicker-anim" : "holo-idle-float"}`}
                                >
                                    {/* Image with filters applied to simulate a projected blue hologram */}
                                    <img
                                        src={holoImages[holoIndex]}
                                        alt="Techfest Holographic Display"
                                        className="w-full h-full object-cover opacity-80 mix-blend-screen filter sepia hue-rotate-180 saturate-200 contrast-125"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                        }}
                                    />
                                    {/* Blue glowing overlay mask */}
                                    <div className="absolute inset-0 bg-cyan-400/20 mix-blend-color"></div>
                                    <div className="holo-scanlines"></div>
                                </div>
                            </div>
                            {/* The glowing projector source on the floor */}
                            <div className="holo-projector-base"></div>
                        </div>
                    </div>
                )}
            </section>

            {/* ================= ORBITAL PARALLAX SECTION ================= */}
            <section
                ref={orbitalContainerRef}
                className="h-[400vh] relative z-2 w-full pointer-events-none"
            >
                <div
                    className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center pointer-events-auto"
                    style={{ perspective: "1200px" }}
                >
                    <div
                        className="absolute top-1/2 left-1/2 z-10 flex items-center justify-center pointer-events-none"
                        style={{
                            transform: `translate(-50%, calc(-50% + ${sunYOffset}px)) scale(${finalSunScale})`,
                            opacity: finalSunOpacity,
                            willChange: "transform, opacity",
                        }}
                    >
                        <div className="absolute w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] max-w-[600px] max-h-[600px] bg-orange-500/20 rounded-full blur-[80px] md:blur-[100px]"></div>
                        <div className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-br from-yellow-200 via-orange-400 to-red-600 rounded-full shadow-[0_0_80px_rgba(251,146,60,0.6)] md:shadow-[0_0_120px_rgba(251,146,60,0.8)] border border-orange-300/30"></div>
                    </div>

                    <div
                        className="glass-panel w-[80vw] max-w-[320px] md:max-w-none md:w-96 p-6 md:p-8 rounded-3xl flex flex-col items-center justify-center text-center transition-all duration-700 ease-out will-change-transform"
                        style={getCardStyle(scrollProgress, 0.0, 0.55)}
                    >
                        <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-white">
                            Why Techfest?
                        </h1>
                        <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                            Techfest IIT Bombay is a transformative experience
                            and Asia's largest science and tech festival. It's
                            your chance to hone skills, network with industry
                            leaders, and gain global exposure. Meet peers and
                            professionals from around the world, enjoy Ozone
                            activities, and witness electrifying TechX
                            performances. Whether you're passionate about tech,
                            innovation, or making connections, Techfest opens
                            doors to endless possibilities. Join us and be part
                            of something extraordinary!
                        </p>
                    </div>

                    <div
                        className="glass-panel w-[80vw] max-w-[320px] md:max-w-none md:w-96 p-6 md:p-8 rounded-3xl flex flex-col items-center justify-center text-center transition-all duration-700 ease-out will-change-transform"
                        style={getCardStyle(scrollProgress, 0.22, 0.77)}
                    >
                        <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-white">
                            Why Techfest?
                        </h1>
                        <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                            Techfest IIT Bombay is a transformative experience
                            and Asia's largest science and tech festival. It's
                            your chance to hone skills, network with industry
                            leaders, and gain global exposure. Meet peers and
                            professionals from around the world, enjoy Ozone
                            activities, and witness electrifying TechX
                            performances. Whether you're passionate about tech,
                            innovation, or making connections, Techfest opens
                            doors to endless possibilities. Join us and be part
                            of something extraordinary!
                        </p>
                    </div>

                    <div
                        className="glass-panel w-[80vw] max-w-[320px] md:max-w-none md:w-96 p-6 md:p-8 rounded-3xl flex flex-col items-center justify-center text-center transition-all duration-700 ease-out will-change-transform"
                        style={getCardStyle(scrollProgress, 0.45, 1.0)}
                    >
                        <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-white">
                            Why Techfest?
                        </h1>
                        <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                            Techfest IIT Bombay is a transformative experience
                            and Asia's largest science and tech festival. It's
                            your chance to hone skills, network with industry
                            leaders, and gain global exposure. Meet peers and
                            professionals from around the world, enjoy Ozone
                            activities, and witness electrifying TechX
                            performances. Whether you're passionate about tech,
                            innovation, or making connections, Techfest opens
                            doors to endless possibilities. Join us and be part
                            of something extraordinary!
                        </p>
                    </div>
                </div>
            </section>

            {/* ================= FOOTER SECTION ================= */}
            <section className="relative min-h-screen py-20 w-full overflow-hidden flex flex-col items-center justify-center z-2 bg-gradient-to-b from-transparent to-slate-950/95 pt-40">
                <div className="z-10 text-center px-4 w-full">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 md:mb-12 text-white">
                        Join the Community
                    </h2>

                    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 max-w-3xl mx-auto">
                        <a
                            href="https://www.instagram.com/techfest_iitbombay/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all text-white hover:text-pink-400 group"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="md:w-6 md:h-6 group-hover:rotate-12 transition-transform"
                            >
                                <rect
                                    x="2"
                                    y="2"
                                    width="20"
                                    height="20"
                                    rx="5"
                                    ry="5"
                                ></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line
                                    x1="17.5"
                                    y1="6.5"
                                    x2="17.51"
                                    y2="6.5"
                                ></line>
                            </svg>
                        </a>
                        <a
                            href="https://in.linkedin.com/company/techfest"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all text-white hover:text-blue-400 group"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="md:w-6 md:h-6 group-hover:rotate-12 transition-transform"
                            >
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                <rect x="2" y="9" width="4" height="12"></rect>
                                <circle cx="4" cy="4" r="2"></circle>
                            </svg>
                        </a>
                        <a
                            href="https://www.facebook.com/iitbombaytechfest/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all text-white hover:text-blue-500 group"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="md:w-6 md:h-6 group-hover:rotate-12 transition-transform"
                            >
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                        </a>
                        <a
                            href="https://youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all text-white hover:text-red-500 group"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="md:w-6 md:h-6 group-hover:rotate-12 transition-transform"
                            >
                                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                            </svg>
                        </a>
                        <a
                            href="https://x.com/Techfest_IITB"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all text-white hover:text-slate-300 group"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="md:w-6 md:h-6 group-hover:rotate-12 transition-transform"
                            >
                                <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                ></path>
                                <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
                            </svg>
                        </a>
                        <a
                            href="https://discord.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all text-white hover:text-indigo-400 group"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="md:w-6 md:h-6 group-hover:rotate-12 transition-transform"
                            >
                                <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                ></path>
                                <path d="M8 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"></path>
                                <path d="M14 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"></path>
                                <path d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-1 2a11.913 11.913 0 0 0 -4 0l-1 -2c-1.5 .16 -3.043 .485 -4.5 1.5c-2 5.667 -2.167 9.833 -1.5 11.5c.667 1.333 2 3 3.5 3c.5 0 2 -2 2 -3"></path>
                                <path d="M7 16.5c3.5 2 6.5 2 10 0"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
