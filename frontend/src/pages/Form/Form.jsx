import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, User, Hash, Phone } from "lucide-react";

const verticals = [
    "Competitions",
    "Exhibitions",
    "Robowars",
    "Lectures",
    "Infrastructure",
    "Ozone",
    "Technoholix",
    "Marketing",
    "Hospitality",
    "Foods n Beverages",
    "Web",
    "Creative",
    "Media n Publicity",
];

const globalStyles = `
  :root {
    --cyan-50: #ecfeff;
    --cyan-200: #a5f3fc;
    --cyan-300: #67e8f9;
    --cyan-400: #22d3ee;
    --cyan-500: #06b6d4;
    --blue-500: #3b82f6;
    --purple-500: #a855f7;
    --slate-950: #020617;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .app-container {
    min-height: 100vh;
    background-color: var(--slate-950);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    color: var(--cyan-50);
  }

  /* Deep Space Background */
  .bg-overlay {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }
  .bg-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.4;
    mix-blend-mode: screen;
  }
  .bg-scanlines {
    position: absolute;
    inset: 0;
    background: linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%),
                linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,0,255,0.06));
    background-size: 100% 4px, 3px 100%;
    z-index: 2;
    pointer-events: none;
    opacity: 0.3;
  }
  .bg-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent, rgba(8, 51, 68, 0.2), rgba(2, 6, 23, 0.9));
  }

  /* Black Hole Submission Sequence */
  .black-hole-overlay {
    position: fixed;
    inset: 0;
    z-index: 4;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    mix-blend-mode: screen;
  }
  .black-hole-img {
    width: 120vw;
    height: 120vh;
    max-width: none;
    max-height: none;
    object-fit: cover;
    opacity: 0.9;
  }

  /* Success Message Overlay */
  .success-overlay {
    position: fixed;
    inset: 0;
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    padding: 0 1rem;
  }
  .success-box {
    text-align: center;
    background-color: rgba(0, 0, 0, 0.4);
    padding: 2.5rem;
    border-radius: 1.5rem;
    backdrop-filter: blur(4px);
    border: 1px solid rgba(6, 182, 212, 0.3);
    box-shadow: 0 0 50px rgba(6, 182, 212, 0.3);
  }
  .success-title {
    font-size: 2.25rem;
    font-weight: 900;
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    background-image: linear-gradient(to right, var(--cyan-300), var(--blue-500), var(--purple-500));
    filter: drop-shadow(0 0 20px rgba(34, 211, 238, 0.8));
    margin-bottom: 1rem;
  }
  @media (min-width: 768px) {
    .success-title { font-size: 3.75rem; }
  }
  .success-subtitle {
    color: var(--cyan-200);
    font-size: 1.125rem;
  }

  /* Holographic Form Container */
  .form-container {
    position: relative;
    z-index: 20;
    max-width: 56rem;
    width: 100%;
    margin: 5rem 1rem;
    overflow: hidden;
    border-radius: 1rem;
    border: 2px solid transparent;
    backdrop-filter: blur(12px);

    @media (max-width: 480px) {
        width: 90%;
    }
  }
  .form-content {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
  }
  @media (min-width: 768px) {
    .form-content { padding: 2.5rem; }
  }

  /* Form Header */
  .form-header {
    text-align: center;
    margin-bottom: 0.5rem;
  }
  .form-title {
    font-size: 1.875rem;
    font-weight: 700;
    background-clip: text;
    color: transparent;
    background-image: linear-gradient(to right, var(--cyan-400), var(--blue-500));
  }
  @media (min-width: 768px) {
    .form-title { font-size: 2.25rem; }
  }
  .form-subtitle {
    color: rgba(34, 211, 238, 0.6);
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }

  /* Input Fields */
  .inputs-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  @media (min-width: 768px) {
    .inputs-grid { grid-template-columns: repeat(2, 1fr); }
    .input-full-width { grid-column: span 2; }
  }
  .input-wrapper {
    position: relative;
  }
  .input-icon-wrapper {
    position: absolute;
    inset-block: 0;
    left: 0;
    padding-left: 1rem;
    display: flex;
    align-items: center;
    pointer-events: none;
  }
  .input-icon {
    height: 1.25rem;
    width: 1.25rem;
    color: rgba(6, 182, 212, 0.7);
    transition: color 0.3s;
  }
  .input-wrapper:focus-within .input-icon {
    color: var(--cyan-300);
  }
  .input-field {
    width: 100%;
    background-color: rgba(15, 23, 42, 0.4);
    border: 1px solid rgba(8, 145, 178, 0.4);
    border-radius: 0.75rem;
    padding: 1rem 1rem 1rem 3rem;
    color: var(--cyan-50);
    font-size: 0.875rem;
    transition: all 0.3s;
    box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.5);
  }
  .input-field::placeholder {
    color: rgba(8, 145, 178, 0.5);
  }
  .input-field:focus {
    outline: none;
    border-color: var(--cyan-300);
    box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--cyan-300);
    background-color: rgba(8, 51, 68, 0.3);
  }
  .input-field:hover:not(:focus) {
    border-color: rgba(34, 211, 238, 0.6);
  }

  /* Verticals Selection */
  .verticals-section {
    margin-top: 1rem;
  }
  .verticals-title {
    color: var(--cyan-300);
    font-size: 0.875rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid rgba(21, 94, 117, 0.5);
    padding-bottom: 0.5rem;
  }
  .verticals-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  @media (min-width: 768px) {
    .verticals-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media (min-width: 1024px) {
    .verticals-grid { grid-template-columns: repeat(4, 1fr); }
  }
  .vertical-btn {
    position: relative;
    padding: 1rem 0.75rem;
    border-radius: 0.75rem;
    border: 1px solid;
    font-size: 0.75rem;
    font-weight: 700;
    text-align: center;
    transition: background-color 0.3s, border-color 0.3s, color 0.3s;
    backdrop-filter: blur(4px);
    user-select: none;
    cursor: pointer;
  }
  @media (min-width: 768px) {
    .vertical-btn { font-size: 0.875rem; }
  }

  /* Submit Button */
  .submit-btn {
    width: 100%;
    margin-top: 1.5rem;
    padding: 1.25rem;
    background: linear-gradient(90deg, rgba(6,182,212,0.2) 0%, rgba(59,130,246,0.6) 50%, rgba(6,182,212,0.2) 100%);
    border: 1px solid rgba(34, 211, 238, 0.6);
    border-radius: 0.75rem;
    font-weight: 700;
    color: white;
    text-transform: uppercase;
    font-size: 1.125rem;
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.4), inset 0 0 15px rgba(6, 182, 212, 0.3);
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }
  .submit-btn-glow {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, var(--cyan-400), var(--blue-500), var(--cyan-400));
    opacity: 0;
    transition: opacity 0.5s;
    filter: blur(12px);
  }
  .submit-btn:hover .submit-btn-glow {
    opacity: 0.2;
  }
  .submit-btn-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
  }
  .submit-icon {
    color: var(--cyan-200);
  }
`;

export default function App() {
    const [phase, setPhase] = useState("hidden"); // hidden -> line -> expand -> content
    const [formData, setFormData] = useState({
        name: "",
        roll: "",
        contact: "",
    });
    const [selectedVerticals, setSelectedVerticals] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Entrance Animation Sequence
    useEffect(() => {
        const t1 = setTimeout(() => setPhase("line"), 200);
        const t2 = setTimeout(() => setPhase("expand"), 1000);
        const t3 = setTimeout(() => setPhase("content"), 2000);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, []);

    const toggleVertical = (vertical) => {
        setSelectedVerticals((prev) =>
            prev.includes(vertical)
                ? prev.filter((v) => v !== vertical)
                : [...prev, vertical],
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.roll || !formData.contact) {
            alert(
                "Please fill out all personal details to initialize sequence.",
            );
            return;
        }
        if (selectedVerticals.length === 0) {
            alert("Please select at least one Vertical of Interest.");
            return;
        }

        // Trigger Black Hole Sequence
        setIsSubmitting(true);

        try {
            const response = await fetch(
                "https://coordie.techfest.org/player/create_coordi/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        roll_no: formData.roll,
                        contact_no: formData.contact,
                        verticals: selectedVerticals, // Array of strings
                    }),
                },
            );

            if (response.ok) {
                // Keep the timeout so your Black Hole animation has time to play
                setTimeout(() => {
                    setIsSubmitted(true);
                }, 2000);
            } else {
                const errorData = await response.json();
                alert(
                    `Submission Failed: ${errorData.error || "Unknown error occurred."}`,
                );
                setIsSubmitting(false); // Stop the black hole animation so the user can fix errors
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Network error. Please check your connection and try again.");
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <style>{globalStyles}</style>
            <div className="app-container">
                {/* Deep Space Background Overlay */}
                <div className="bg-overlay">
                    <img
                        src="https://wallpapers.com/images/hd/dark-space-wallpaper-jyc27cfs36u9ceyc.jpg"
                        alt="Space Background"
                        className="bg-image"
                    />
                    <div className="bg-scanlines"></div>
                    <div className="bg-gradient"></div>
                </div>

                {/* Black Hole Submission Sequence */}
                {/* <AnimatePresence>
                    {isSubmitting && (
                        <motion.div
                            initial={{ scale: 8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 2.5, ease: "circOut" }}
                            className="black-hole-overlay"
                        >
                            <img
                                src="https://i.pinimg.com/originals/c3/16/27/c3162775635d404d6462187ea4b5941f.gif"
                                alt="Black Hole"
                                className="black-hole-img"
                            />
                        </motion.div>
                    )}
                </AnimatePresence> */}

                {/* Success Message */}
                <AnimatePresence>
                    {isSubmitted && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.5,
                                filter: "blur(10px)",
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                filter: "blur(0px)",
                            }}
                            transition={{
                                duration: 1.5,
                                delay: 0.1,
                                ease: "easeOut",
                            }}
                            className="success-overlay"
                        >
                            <div className="success-box">
                                <h1 className="success-title">
                                    Registration
                                    <br />
                                    Complete
                                </h1>
                                <p className="success-subtitle">
                                    Welcome Aboard, Explorer.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Holographic Form Container */}
                <AnimatePresence>
                    {!isSubmitting && (
                        <motion.div
                            key="registration-form"
                            initial={{
                                height: "0px",
                                width: "4px",
                                opacity: 0,
                            }}
                            animate={{
                                height:
                                    phase === "hidden"
                                        ? "0px"
                                        : phase === "line"
                                          ? "600px"
                                          : "auto",
                                width:
                                    phase === "hidden"
                                        ? "4px"
                                        : phase === "line"
                                          ? "4px"
                                          : "100%",
                                opacity: phase === "hidden" ? 0 : 1,
                                backgroundColor:
                                    phase === "line"
                                        ? "#06b6d4"
                                        : "rgba(8, 47, 73, 0.25)",
                                borderColor:
                                    phase === "line"
                                        ? "#22d3ee"
                                        : "rgba(6, 182, 212, 0.4)",
                            }}
                            exit={{
                                scale: 0,
                                rotate: 1080,
                                filter: "blur(20px)",
                                opacity: 0,
                            }}
                            transition={{
                                duration: 1.5,
                                ease: "easeInOut",
                                exit: { duration: 1.8, ease: "anticipate" },
                            }}
                            className="form-container"
                        >
                            {(phase === "expand" || phase === "content") && (
                                <motion.form
                                    onSubmit={handleSubmit}
                                    initial={{ opacity: 0 }}
                                    animate={{
                                        opacity: phase === "content" ? 1 : 0,
                                    }}
                                    transition={{ duration: 0.8 }}
                                    className="form-content"
                                >
                                    <div className="form-header">
                                        <h1 className="form-title">
                                            Coordinator Registration
                                        </h1>
                                    </div>

                                    {/* Glassy Input Fields */}
                                    <div className="inputs-grid">
                                        <div className="input-wrapper input-full-width">
                                            <div className="input-icon-wrapper">
                                                <User className="input-icon" />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Name"
                                                className="input-field"
                                            />
                                        </div>

                                        <div className="input-wrapper">
                                            <div className="input-icon-wrapper">
                                                <Hash className="input-icon" />
                                            </div>
                                            <input
                                                type="text"
                                                name="roll"
                                                required
                                                value={formData.roll}
                                                onChange={handleInputChange}
                                                placeholder="Roll No."
                                                className="input-field"
                                            />
                                        </div>

                                        <div className="input-wrapper">
                                            <div className="input-icon-wrapper">
                                                <Phone className="input-icon" />
                                            </div>
                                            <input
                                                type="tel"
                                                name="contact"
                                                required
                                                value={formData.contact}
                                                onChange={handleInputChange}
                                                placeholder="Contact"
                                                className="input-field"
                                            />
                                        </div>
                                    </div>

                                    {/* Verticals Selection (3D Popout Buttons) */}
                                    <div className="verticals-section">
                                        <h3 className="verticals-title">
                                            Select Verticals of Your Interest
                                        </h3>
                                        <div className="verticals-grid">
                                            {verticals.map((v) => {
                                                const isSelected =
                                                    selectedVerticals.includes(
                                                        v,
                                                    );
                                                return (
                                                    <motion.button
                                                        key={v}
                                                        type="button"
                                                        onClick={() =>
                                                            toggleVertical(v)
                                                        }
                                                        style={{
                                                            padding: "10px",
                                                        }}
                                                        whileTap={{
                                                            scale: 0.9,
                                                            y: 2,
                                                            boxShadow:
                                                                "0px 0px 0px rgba(0,0,0,0)",
                                                        }}
                                                        animate={{
                                                            scale: isSelected
                                                                ? 1.05
                                                                : 1,
                                                            y: isSelected
                                                                ? -4
                                                                : 0,
                                                            boxShadow:
                                                                isSelected
                                                                    ? "0px 10px 20px rgba(255, 69, 0, 0.5), 0px 4px 0px rgba(200, 50, 0, 1), inset 0px 0px 15px rgba(255, 69, 0, 0.4)"
                                                                    : "0px 4px 10px rgba(6, 182, 212, 0.1), 0px 2px 0px rgba(6, 182, 212, 0.3), inset 0px 0px 0px rgba(0,0,0,0)",
                                                            borderColor:
                                                                isSelected
                                                                    ? "rgba(255, 85, 0, 0.8)"
                                                                    : "rgba(6, 182, 212, 0.3)",
                                                            backgroundColor:
                                                                isSelected
                                                                    ? "rgba(255, 69, 0, 0.15)"
                                                                    : "rgba(15, 23, 42, 0.6)",
                                                            color: isSelected
                                                                ? "#ffd1b3"
                                                                : "#a5f3fc",
                                                        }}
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 400,
                                                            damping: 25,
                                                        }}
                                                        className="vertical-btn"
                                                    >
                                                        {v}
                                                    </motion.button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Submit Launch Button */}
                                    <motion.button
                                        whileHover={{
                                            scale: 1.02,
                                            textShadow:
                                                "0px 0px 8px rgb(255,255,255)",
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        type="submit"
                                        className="submit-btn"
                                    >
                                        <div className="submit-btn-glow"></div>
                                        <span className="submit-btn-content">
                                            Submit
                                        </span>
                                    </motion.button>
                                </motion.form>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
