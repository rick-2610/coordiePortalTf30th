import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Particles from "./components/Particles";
import { motion } from "framer-motion";

// Data for the cards
const cardsData = [
    {
        id: 1,
        title: "Techfest Manager",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        id: 2,
        title: "Techfest Manager",
        description:
            "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
        id: 3,
        title: "Techfest Manager",
        description:
            "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    },
    {
        id: 4,
        title: "Techfest Manager",
        description:
            "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
        id: 5,
        title: "Techfest Manager",
        description:
            "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores.",
    },
    {
        id: 6,
        title: "Techfest Manager",
        description:
            "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam.",
    },
];

// --- Global Custom CSS ---
const GlobalStyles = () => (
    <style>{`
    /* Reset & Base Styles */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    button {
      background: none;
      border: none;
      outline: none;
      font-family: inherit;
    }

    body {
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #e5e7eb; /* gray-200 */
      -webkit-font-smoothing: antialiased;
      background-color: #030712; 
    }

    ::selection {
      background-color: rgba(168, 85, 247, 0.3); /* purple-500/30 */
      color: #ffffff;
    }

    /* Layout & Section Styles */
    .app-container {
      min-height: 100vh;
      position: relative;
      pointer-events: none;
    }

    .header-section {
      padding: 5rem 2rem 2rem 2rem;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .header-glow {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 75%;
      height: 8rem;
    //   background-color: rgba(147, 51, 234, 0.2);
      filter: blur(100px);
      border-radius: 9999px;
      pointer-events: none;
    }

    .header-content {
      max-width: 48rem; /* 3xl */
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      z-index: 10;
      pointer-events: auto;
    }

    .header-icon-wrapper {
      padding: 1rem;
      background-color: #111827; /* gray-900 */
      border: 1px solid #1f2937; /* gray-800 */
      border-radius: 1rem;
      margin-bottom: 2rem;
      color: #22d3ee; /* cyan-400 */
      box-shadow: 0 0 20px rgba(34, 211, 238, 0.15);
    }

    .main-title {
      font-size: 3rem;
      font-weight: 800;
      color: transparent;
      background-clip: text;
      background-image: linear-gradient(to right, #8b5cf6, #38bdf8); /* purple to blue left to right */
      margin-bottom: 1.5rem;
    }

    @media (min-width: 768px) {
      .main-title { font-size: 3.75rem; line-height: 1; } /* 6xl */
    }

    .header-subtitle {
      font-size: 1.125rem; /* lg */
      color: #9ca3af;
      line-height: 1.625;
      max-width: 36rem; /* xl */
      margin: 0 auto;
    }

    /* Main Grid Section */
    .main-section {
      max-width: 72rem; /* 6xl */
      margin: 0 auto;
      padding: 1.5rem;
      position: relative;
    }

    .main-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 500px;
      background-color: rgba(147, 51, 234, 0.1);
      filter: blur(120px);
      border-radius: 9999px;
      pointer-events: none;
    }

    .card-grid {
      display: grid;
      grid-template-columns: repeat(1, minmax(0, 1fr));
      gap: 2rem;
      position: relative;
      z-index: 10;
    }

    @media (min-width: 640px) {
      .card-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (min-width: 1024px) {
      .card-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    }

    /* Card Component */
    .profile-card {
        position: relative;
        background: rgba(17, 24, 39, 0.4); /* Original gray-900 made semi-transparent */
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(12px); /* Required for Safari support */
        
        border-radius: 1.5rem;
        padding: 2rem;
        cursor: pointer;
        
        /* Semi-transparent light border gives the "glass edge" look */
        border: 1px solid rgba(255, 255, 255, 0.1); 
        
        /* Slightly tweaked shadow for better glass depth */
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37); 
        
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        height: 100%;
        pointer-events: auto;
        }

        .profile-card:hover {
        /* Maintained your purple hover effects */
        box-shadow: 0 0 30px rgba(168, 85, 247, 0.2);
        border-color: rgba(168, 85, 247, 0.5); /* purple-500/50 */
        transform: translateY(-0.5rem);
        
        /* Optional: Make the card slightly more opaque on hover */
        background: rgba(17, 24, 39, 0.6); 
    }

    .card-decoration {
      position: absolute;
      top: 0;
      right: 0;
      padding: 1.5rem;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .profile-card:hover .card-decoration {
      opacity: 1;
    }

    .card-decoration-icon {
      padding: 0.5rem;
      background-color: #1f2937; /* gray-800 */
      border-radius: 9999px;
      color: #22d3ee; /* cyan-400 */
      box-shadow: 0 0 10px rgba(34, 211, 238, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card-arrow {
      transform: rotate(-45deg);
      transition: transform 0.3s ease;
    }

    .profile-card:hover .card-arrow {
      transform: rotate(0deg);
    }

    .card-content {
      margin-top: auto;
      padding-top: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .card-avatar {
      width: 4rem;
      height: 4rem;
      background-image: linear-gradient(to bottom right, #a855f7, #06b6d4); /* purple to cyan */
      border-radius: 9999px;
      margin-bottom: 1.5rem;
      box-shadow: 0 0 15px rgba(168, 85, 247, 0.5);
      transition: transform 0.3s ease;
    }

    .profile-card:hover .card-avatar {
      transform: scale(1.1);
    }

    .card-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #f3f4f6; /* gray-100 */
      margin-bottom: 0.75rem;
      text-align: center;
      transition: color 0.3s ease, background-color 0.3s ease;
    }

    .profile-card:hover .card-title {
      color: transparent;
      background-clip: text;
      -webkit-background-clip: text;
      background-image: linear-gradient(to right, #c084fc, #22d3ee); /* purple-400 to cyan-400 */
    }

    .card-description {
      color: #9ca3af; /* gray-400 */
      line-height: 1.625;
      text-align: center;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* Modal & Overlay Styles */
    .modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(3, 7, 18, 0.8); /* gray-950/80 */
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      pointer-events: auto;
    }

    .modal-close-btn {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      padding: 0.75rem;
      border-radius: 9999px;
      background-color: rgba(17, 24, 39, 0.5); /* gray-900/50 */
      border: 1px solid #374151; /* gray-700 */
      color: #9ca3af; /* gray-400 */
      transition: all 0.3s ease;
      z-index: 60;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-close-btn:hover {
      background-color: #1f2937; /* gray-800 */
      color: #ffffff;
      border-color: #a855f7; /* purple-500 */
    }

    .modal-header {
      position: absolute;
      top: 3rem;
      left: 0;
      width: 100%;
      text-align: center;
      z-index: 60;
      pointer-events: none;
    }

    .modal-title {
      font-size: 2.25rem; /* 4xl */
      font-weight: 800;
      color: transparent;
      background-clip: text;
      -webkit-background-clip: text;
      background-image: linear-gradient(to right, #c084fc, #22d3ee); /* purple-400 to cyan-400 */
      filter: drop-shadow(0 0 15px rgba(168, 85, 247, 0.5));
    }

    .modal-subtitle {
      color: #9ca3af; /* gray-400 */
      margin-top: 0.5rem;
      max-width: 32rem; /* lg */
      margin-left: auto;
      margin-right: auto;
      padding: 0 1rem;
      font-weight: 300;
    }

    .nav-button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      padding: 1rem;
      border-radius: 9999px;
      background-color: rgba(17, 24, 39, 0.6); /* gray-900/60 */
      border: 1px solid rgba(168, 85, 247, 0.3); /* purple-500/30 */
      color: #c084fc; /* purple-400 */
      transition: all 0.3s ease;
      z-index: 60;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .nav-button:hover {
      background-color: rgba(168, 85, 247, 0.2); /* purple-500/20 */
      color: #ffffff;
      transform: translateY(-50%) scale(1.1);
      box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
    }

    .nav-prev { left: 1rem; }
    .nav-next { right: 1rem; }

    @media (min-width: 768px) {
      .nav-prev { left: 3rem; }
      .nav-next { right: 3rem; }
    }

    /* 3D Carousel Scene */
    .perspective-scene {
      perspective: 1200px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
    }

    .carousel-spinner {
      position: relative;
      width: 240px; 
      height: 200px; 
      transform-style: preserve-3d;
      transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .carousel-item {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 0 15px rgba(168, 85, 247, 0.3), inset 0 0 10px rgba(168, 85, 247, 0.2);
      border: 1px solid rgba(168, 85, 247, 0.4);
      
      transform: rotateY(var(--target-angle)) translateZ(var(--tz-radius));
      animation: circleInFromRight 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
      
      transition: filter 0.4s ease, box-shadow 0.4s ease;
      filter: brightness(0.4) saturate(0.8);
    }

    .carousel-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .carousel-item.active {
      filter: brightness(1.2) saturate(1.2);
      box-shadow: 0 0 30px rgba(168, 85, 247, 0.8), inset 0 0 15px rgba(168, 85, 247, 0.5);
      border-color: rgba(217, 70, 239, 0.8);
    }

    @keyframes circleInFromRight {
      0% {
        opacity: 0;
        transform: rotateY(calc(var(--target-angle) + 90deg)) translateZ(calc(var(--tz-radius) + 200px)) scale(0.8);
      }
      100% {
        opacity: 1;
        transform: rotateY(var(--target-angle)) translateZ(var(--tz-radius)) scale(1);
      }
    }

    @media (max-width: 768px) {
      .carousel-spinner {
        transform: scale(0.7) rotateY(var(--current-rotation));
      }
    }
  `}</style>
);

// 3D Carousel Modal Component
const CarouselModal = ({ card, onClose }) => {
    const [rotation, setRotation] = useState(0);
    const numItems = 8;
    const angleStep = 360 / numItems;
    const tzRadius = 340;

    // Generate 8 images based on the card's seed
    const images = Array.from({ length: numItems }).map(
        (_, i) =>
            `https://placehold.co/400x560/111827/a855f7?text=${encodeURIComponent(card.title)}%5CnAsset+${i + 1}`,
    );

    const handleNext = () => setRotation((prev) => prev - angleStep);
    const handlePrev = () => setRotation((prev) => prev + angleStep);

    // Calculate which item is currently facing the front
    let activeIndex = Math.round(-rotation / angleStep) % numItems;
    if (activeIndex < 0) activeIndex += numItems;

    return (
        <div className="modal-overlay">
            <GlobalStyles />

            {/* Close Button */}
            <button onClick={onClose} className="modal-close-btn">
                <X size={24} />
            </button>

            {/* Selected Card Title Display */}
            <div className="modal-header">
                <h1 className="modal-title">{card.title}</h1>
            </div>

            {/* Navigation Arrows */}
            <button onClick={handlePrev} className="nav-button nav-prev">
                <ChevronLeft size={32} />
            </button>

            <button onClick={handleNext} className="nav-button nav-next">
                <ChevronRight size={32} />
            </button>

            {/* 3D Scene */}
            <div className="perspective-scene">
                <div
                    className="carousel-spinner"
                    style={{
                        transform: `rotateY(${rotation}deg)`,
                        "--current-rotation": `${rotation}deg`,
                    }}
                >
                    {images.map((imgSrc, index) => {
                        const angle = index * angleStep;
                        return (
                            <div
                                key={index}
                                className={`carousel-item ${index === activeIndex ? "active" : ""}`}
                                style={{
                                    "--target-angle": `${angle}deg`,
                                    "--tz-radius": `${tzRadius}px`,
                                    // Stagger the animation so they swoop in one after another
                                    animationDelay: `${index * 0.15}s`,
                                }}
                            >
                                <img
                                    src={imgSrc}
                                    alt={`${card.title} preview ${index + 1}`}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default function App() {
    const [activeCard, setActiveCard] = useState(null);

    // Prevent scrolling when the modal is active
    useEffect(() => {
        if (activeCard) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [activeCard]);

    return (
        <div className="app-container">
            <GlobalStyles />

            {/* FIXED PARTICLES BACKGROUND */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 10,
                    pointerEvents: "auto",
                }}
            >
                <Particles
                    particleColors={["#ffffff"]}
                    particleCount={200}
                    particleSpread={10}
                    speed={0.1}
                    particleBaseSize={80}
                    moveParticlesOnHover
                    alphaParticles={false}
                    disableRotation={false}
                    pixelRatio={1}
                />
            </div>

            {/* Header */}
            <div className="header-section">
                {/* Neon Glow Effects behind header */}
                <div className="header-glow"></div>

                <div className="header-content">
                    <h1 className="main-title">Explore the Verticals</h1>
                    <p className="header-subtitle">
                        Click on any vertical to start exploring
                    </p>
                </div>
            </div>

            <main className="main-section">
                {/* Decorative background glow */}
                <div className="main-glow"></div>

                <div className="card-grid">
                    {cardsData.map((card) => (
                        <motion.div
                            key={card.id}
                            onClick={() => setActiveCard(card)}
                            className="profile-card"
                        >
                            {/* Center Aligned Content */}
                            <div className="card-content">
                                <div className="card-avatar"></div>
                                <h3 className="card-title">{card.title}</h3>
                                <p className="card-description">
                                    {card.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* Conditionally Render the 3D Carousel Modal */}
            {activeCard && (
                <CarouselModal
                    card={activeCard}
                    onClose={() => setActiveCard(null)}
                />
            )}
        </div>
    );
}
