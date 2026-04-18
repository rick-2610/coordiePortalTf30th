import React, {
    useState,
    useEffect,
    useRef,
    useMemo,
    useCallback,
} from "react";
import {
    motion,
    useScroll,
    useTransform,
    useMotionTemplate,
    animate,
    useMotionValue,
    useSpring,
} from "framer-motion";

import lectures from "./assets/lectures.png";
import robowars from "./assets/robowars.png";
import compi from "./assets/compi.png";
import infra from "./assets/infra.png";
import exhi from "./assets/exhi.jpeg";
import techx from "./assets/techx.jpeg";
import ozone from "./assets/ozone.jpeg";
import marki from "./assets/marki.jpeg";
import hospi from "./assets/hospi.jpeg";
import mnp from "./assets/mnp.jpeg";
import fnb from "./assets/fnb.jpeg";

import image1 from "./assets/image1.jpeg";
import image2 from "./assets/image2.jpeg";
import image3 from "./assets/image3.jpeg";
import image4 from "./assets/image4.jpeg";
import image5 from "./assets/image5.jpeg";
import image6 from "./assets/image6.jpeg";
import image7 from "./assets/image7.jpeg";
import image8 from "./assets/image8.jpeg";

function Logo({ draw, fillOpacity }) {
    return (
        <motion.svg
            style={{ width: "100%", height: "auto", overflow: "visible" }}
            viewBox="0 0 528 428"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <motion.path
                d="M120.298 57.403C119.879 58.4135 119.544 59.4571 119.298 60.523C118.908 62.583 119.808 63.833 121.918 64.143C123.137 64.2697 124.363 64.3165 125.588 64.283H154.588C156.546 64.2736 158.501 64.4443 160.428 64.793C169.998 66.553 173.218 73.243 174.428 79.393C175.358 84.8506 174.96 90.4517 173.268 95.723C172.548 98.183 171.678 100.613 170.758 103.013C160.092 130.793 149.425 158.573 138.758 186.353C129.885 209.446 121.015 232.536 112.148 255.623C103.875 277.023 95.6015 298.39 87.328 319.723C86.9781 320.643 86.5781 321.543 86.1981 322.443C85.6396 324.02 84.5839 325.373 83.1897 326.299C81.7955 327.224 80.1385 327.671 78.4681 327.573H76.9982L24.7882 327.513C23.3201 327.642 21.841 327.492 20.4282 327.073C18.9182 326.503 18.1882 325.463 18.6482 323.943C19.158 322.31 19.8001 320.721 20.5681 319.193C25.9681 308.193 31.4281 297.193 36.8281 286.193C49.7415 259.913 62.6382 233.63 75.5182 207.343C86.0782 185.776 96.6282 164.206 107.168 142.633C113.048 130.723 118.998 118.723 124.898 106.723C125.474 105.642 125.958 104.514 126.348 103.353C126.704 102.419 126.681 101.382 126.283 100.464C125.885 99.5467 125.144 98.8213 124.218 98.443C122.225 97.4908 120.091 96.8661 117.898 96.593C114.378 96.063 110.838 95.983 107.278 95.793C103.729 95.6895 100.201 95.1999 96.7582 94.333C92.815 93.3468 89.1964 91.3515 86.2582 88.543C81.2582 83.593 79.5381 77.543 80.5681 70.733C81.009 67.6925 81.984 64.754 83.4481 62.053C89.7981 50.443 95.7082 38.593 102.778 27.393C105.188 23.5492 107.801 19.8372 110.608 16.273C113.166 12.9749 116.172 10.0501 119.538 7.583C125.728 3.713 126.538 2.69302 134.058 1.04302C137.688 0.382619 141.369 0.047954 145.058 0.0430247H379.988C381.859 -0.108286 383.741 0.140547 385.508 0.773005C387.028 1.23301 387.618 3.07303 387.278 4.51303C387.021 5.46198 386.686 6.38836 386.278 7.28301C384.658 11.123 383.008 14.953 381.368 18.773C381.128 19.333 380.848 19.883 380.608 20.443C380.215 21.4865 379.498 22.3766 378.562 22.9831C377.626 23.5895 376.521 23.8804 375.408 23.813C374.678 23.813 373.938 23.813 373.198 23.813C338.398 23.813 313.538 23.813 278.728 23.813C234.481 23.813 190.235 23.7764 145.988 23.703C143.908 23.703 141.818 23.703 139.738 23.773C135.508 23.773 131.508 27.263 129.668 32.563"
                fill="white"
                stroke="white"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{ pathLength: draw, fillOpacity }}
            />
            <motion.path
                d="M265.891 193.882C263.287 193.883 260.725 194.534 258.437 195.778C256.149 197.021 254.208 198.817 252.791 201.002L251.301 203.302C240.231 220.662 229.301 238.122 217.621 255.072C210.041 266.072 202.181 276.882 193.561 287.072C181.951 300.812 168.361 312.072 151.971 319.762C144.385 323.256 136.277 325.486 127.971 326.362C117.821 327.532 109.031 327.082 98.871 327.062C98.1344 327.066 97.4008 326.968 96.6909 326.772C96.1636 326.599 95.7217 326.232 95.4544 325.746C95.1871 325.259 95.1144 324.69 95.251 324.152C95.8297 322.113 96.5275 320.109 97.341 318.152C98.491 315.212 98.871 314.682 99.851 312.152C102.131 306.272 103.211 305.012 108.611 305.012H125.411C134.541 305.012 141.131 302.112 148.021 297.742C149.981 296.505 151.876 295.17 153.701 293.742C162.755 286.402 170.953 278.066 178.141 268.892C189.851 254.242 199.001 238.072 206.651 221.012C223.281 183.892 238.481 146.162 253.781 108.492C257.881 98.3917 262.041 88.3117 266.161 78.2217C267.082 75.8154 268.266 73.5182 269.691 71.3717C272.693 66.9705 277.163 63.7804 282.301 62.3717C285.727 61.4014 289.27 60.91 292.831 60.9117H360.101C362.181 60.9117 364.271 60.9117 366.351 60.9117C367.771 60.9018 369.161 60.5044 370.372 59.7625C371.582 59.0206 372.568 57.9623 373.221 56.7017C373.831 55.6417 374.291 54.4917 374.791 53.3817C378.791 44.4417 382.791 35.4917 386.861 26.5717C389.391 20.9917 392.001 15.4517 394.581 9.90172C394.891 9.23172 395.201 8.56172 395.581 7.90172C396.397 6.23627 397.687 4.84825 399.287 3.911C400.888 2.97375 402.729 2.52881 404.581 2.63174C416.101 2.73174 427.581 2.72174 439.151 2.73174C441.24 2.7062 443.318 3.04458 445.291 3.73174C449.111 5.11174 450.571 7.89175 449.591 11.8617C448.985 13.978 448.082 15.998 446.911 17.8617C444.021 22.8617 441.151 27.8617 438.261 32.8617C428.614 49.5284 418.948 66.1651 409.261 82.7717C407.926 85.1112 406.457 87.3716 404.861 89.5417C398.691 97.8017 392.211 99.7017 379.931 99.7017C371.061 99.7017 371.441 99.7017 366.601 99.7017C347.971 99.7017 339.291 99.8517 320.661 99.9217C316.859 99.9173 313.073 100.415 309.401 101.402C303.061 103.122 297.577 107.121 294.001 112.632C292.415 114.965 291.1 117.471 290.081 120.102C287.081 127.872 284.141 135.662 281.191 143.452C280.925 144.139 280.708 144.844 280.541 145.562C279.991 148.072 281.031 149.562 283.661 149.882C284.88 150.003 286.106 150.05 287.331 150.022L317.851 149.962C322.631 149.962 327.411 149.962 332.191 149.962C333.543 149.871 334.899 150.034 336.191 150.442C337.191 150.912 337.821 151.642 337.461 152.712C336.901 154.332 336.241 155.922 335.541 157.482C333.021 163.062 330.431 168.612 327.931 174.202C325.931 178.572 324.141 182.972 322.241 187.362C321.889 188.274 321.485 189.166 321.031 190.032C320.448 191.191 319.559 192.166 318.461 192.855C317.363 193.544 316.097 193.92 314.801 193.942C313.801 193.942 312.801 193.942 311.861 193.942H288.691"
                fill="white"
                stroke="white"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{ pathLength: draw, fillOpacity }}
            />
            <motion.path
                d="M485.122 25.3527H480.592V5.61267H473.672V1.72266H492.052V5.59265H485.122V25.3527Z"
                fill="white"
                stroke="white"
                strokeWidth="2"
                style={{ pathLength: draw, fillOpacity }}
            />
            <motion.path
                d="M515.62 25.3527H511.56L504.07 5.55264H504L504.38 25.3527H499.84V1.72266H507.11L513.54 19.2527H513.66L519.96 1.72266H527.39V25.3326H522.85L523.23 5.43265H523.07L515.62 25.3527Z"
                fill="white"
                stroke="white"
                strokeWidth="2"
                style={{ pathLength: draw, fillOpacity }}
            />
        </motion.svg>
    );
}

// SVG Icons for Social Media Links
const socialLinks = [
    {
        name: "Instagram",
        href: "https://www.instagram.com/techfest_iitbombay/",
        icon: (
            <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
        ),
    },
    {
        name: "Facebook",
        href: "https://www.facebook.com/iitbombaytechfest/",
        icon: (
            <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
        ),
    },
    {
        name: "YouTube",
        href: "https://www.youtube.com/user/techfestiitbombay",
        icon: (
            <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
            </svg>
        ),
    },
    {
        name: "X",
        href: "https://x.com/Techfest_IITB",
        icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 3.827H5.053z" />
            </svg>
        ),
    },
];

// All 13 Departments Data
const departments = [
    {
        id: 1,
        department: "Competitions",
        image: compi,
        content:
            "Step into the heartbeat of Techfest and execute events on a massive, global scale. From managing the high-speed International Drone Racing League and Global Zonals to ideating your very own groundbreaking competitions from scratch, the stage is yours. Build the ultimate arenas, bring your vision to life, and leave your undeniable mark in front of an electrifying crowd of thousands",
    },
    {
        id: 2,
        department: "Creatives",
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80",
        content:
            "Defining the Visual Identity of Asia's Largest Science & Technology Festival. At the core of every great event lies a design language that speaks before words do. The Creatives department is responsible for shaping and sustaining the entire visual identity of Techfest, From brand strategy and graphic design to UI/UX and the aesthetic coherence of every touchpoint. Work alongside a team of designers who set the standard for how one of the world's most prestigious tech festivals looks, feels, and communicates.",
    },
    {
        id: 3,
        department: "Exhibitions",
        image: exhi,
        content:
            "Exhibitions is one of Techfest’s flagship verticals, presenting a curated showcase of cutting-edge tech, encompassing domains such as robotics, AI, and space technology, alongside dedicated segments like the Defense Expo, featuring advanced military systems and strategic technologies, and the Auto Expo, highlighting supercars, superbikes, and other high-performance engineering marvels. Together, these form a comprehensive platform that brings real-world innovation to the forefront in a structured impactful manner.",
    },
    {
        id: 4,
        department: "Marketing",
        image: marki,
        content:
            "Marketing is the force that makes Techfest possible. This is the team that pitches to the biggest companies and corporates, building the entire financial foundation that powers Asia's largest science and technology festival. From cold outreach to closing high-value sponsorships, strategizing, negotiating, and delivering. Nearly every banner, stall, and activation you see on campus during Techfest is Marketing's footprint. Walk away with real-world skills in corporate communication, negotiation, and the art of closing a deal.",
    },
    {
        id: 5,
        department: "Foods n Beverages",
        image: fnb,
        content:
            "Step up to manage the most dynamic and fast-paced operation of Techfest. From curating massive food zones and negotiating with top-tier vendors to executing high-stakes hospitality for tens of thousands of attendees and international guests, you dictate the flavor of the fest. Master the art of crowd management on a grand scale, and be the team that keeps the adrenaline and energy of the entire festival pumping!",
    },
    {
        id: 6,
        department: "Hospitality",
        image: hospi,
        content:
            "Step up as the ultimate ambassadors of Techfest, orchestrating the stay, travel, and seamless experience for thousands of national participants, international delegates, and VIPs. You will master real-time crisis management, command massive on-ground logistics, and build exceptional public relations skills. From crafting a flawless first impression to handling high-profile guests, you are the crucial link that makes the entire festival feel like a world-class experience.",
    },
    {
        id: 7,
        department: "Infrastructure",
        image: infra,
        content: `From massive exhibition hangars and the high-octane Robowars arena to the final spark of the closing fireworks and production, Infrastructure Vertical is what brings Techfest to life.
Joining Infra means being at the center of the action-fast, intense, and always on the move. You’re not just coordinating setups; you’re gliding across the fest solving problems before most people even notice them (yes, sometimes literally on two wheels). Somewhere between the chaos and control, you pick up that Infra aura-no one explains it, but everyone sees it.`,
    },
    {
        id: 8,
        department: "Media n Publicity",
        image: mnp,
        content:
            "Techfest attracts a massive 180 K+ footfall every year, and a major reason behind this reach is its strong Media and Publicity team. From building hype to ensuring Techfest reaches every corner, this department shapes how the festival is seen and remembered. If you’re interested in public outreach, design, video editing, content creation, and execution, this is the place to learn it all. The iconic Techfest aftermovie and managing an Instagram page with 120k+ followers are also handled by this team. If you want creativity, visibility, and real impact, MnP is for you.",
    },
    {
        id: 9,
        department: "Lectures",
        image: lectures,
        content:
            "Lectures is one of Techfest’s flagship events, bringing renowned personalities from across the globe to IIT Bombay to share their ideas, experiences, and journeys. It’s where inspiration sparks insight, and perspectives expand beyond the ordinary. Be part of it, and get a chance to meet those who inspire you.",
    },
    {
        id: 10,
        department: "Ozone",
        image: ozone,
        content:
            "Ozone powers the heart of Techfest’s entertainment and turning ideas into unforgettable experiences. From reaching out to top artists and managing them on-ground, to crafting the entire ambience through stunning main gate designs and immersive installations. Ozone brings the fest to life. We also collaborate with vendors to set up engaging gaming zones and ensure every entertainment element runs seamlessly. It’s where creativity meets execution.",
    },
    {
        id: 11,
        department: "Robowars",
        image: robowars,
        content:
            "International Robowars is India’s largest and most intense combat robotics event, where top teams from around the world build powerful robots and battle for the championship title. With 25+ international teams, global anchors and a roaring audience of 8000+, the arena comes alive as machines clash in a raw display of skill, strategy and destruction.",
    },
    {
        id: 12,
        department: "Technoholix",
        image: techx,
        content:
            "Technoholix transforms Techfest after dark, bringing mind-blowing visual shows and electrifying international artists to light up the campus. It’s where cutting-edge technology and pure entertainment collide to create an unforgettable nighttime spectacle. Be part of the magic-and get the exclusive chance to be an Artist Point of Contact (POC), working directly behind the scenes with the stars of the show.",
    },
    {
        id: 13,
        department: "Web",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
        content:
            "The Web vertical is the digital backbone of Techfest, building the robust platforms, interactive games, and seamless portals that connect millions globally. It’s where innovative coding and scalable architecture collide to run the engine of Asia’s largest science and technology festival. Be the architect of this massive digital ecosystem-and get the exclusive chance to manage high-traffic backend operations, working directly with the core infrastructure that powers the entire fest.",
    },
];

// Images for the Image Trail Section
const trailImagesData = [
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    image7,
    image8,
];

// Sub-component for individual trail image lifecycle
const TrailImage = ({ id, x, y, src, onComplete, displayDuration }) => {
    const [status, setStatus] = useState("entering");

    useEffect(() => {
        const raf = requestAnimationFrame(() => {
            setStatus("active");
        });
        const fadeTimeout = setTimeout(() => {
            setStatus("fading");
        }, displayDuration);
        const removeTimeout = setTimeout(() => {
            onComplete(id);
        }, displayDuration + 400);

        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(fadeTimeout);
            clearTimeout(removeTimeout);
        };
    }, [id, displayDuration, onComplete]);

    let className = "trail-image";
    if (status === "active") className += " active";
    if (status === "fading") className += " fade-out";

    return (
        <img
            src={src}
            className={className}
            style={{ left: `${x}px`, top: `${y}px` }}
            alt=""
        />
    );
};

export default function Home() {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 480);

    // ================== INTRO ANIMATION TRACKING ==================
    const [introComplete, setIntroComplete] = useState(false);
    const introDraw = useMotionValue(0);
    const introFill = useMotionValue(0);
    const introBlackBg = useMotionValue(1);
    const introLogoX = useMotionValue("0");
    const introLogoY = useMotionValue("0");
    const introLogoScale = useMotionValue(1);
    const introLogoOpacity = useMotionValue(1);

    useEffect(() => {
        // Lock scrolling during intro
        document.body.style.overflow = "hidden";

        const seq = async () => {
            // 1. Draw SVG Outlines
            await animate(introDraw, 1, { duration: 1.4, ease: "easeInOut" });
            // 2. Fill the logo
            await animate(introFill, 1, { duration: 0.5, ease: "easeIn" });
            await new Promise((r) => setTimeout(r, 200));
            // 3. Shrink, Move and Fade out the logo overlay
            await Promise.all([
                animate(introBlackBg, 0, { duration: 0.9, ease: "easeInOut" }),
                animate(introLogoScale, 0.18, {
                    duration: 0.9,
                    ease: "easeInOut",
                }),
                animate(introLogoOpacity, 0, {
                    duration: 0.7,
                    ease: "easeIn",
                    delay: 0.2,
                }),
                animate(introLogoX, "-45vw", {
                    duration: 0.9,
                    ease: "easeInOut",
                }),
                animate(introLogoY, "-45vh", {
                    duration: 0.9,
                    ease: "easeInOut",
                }),
            ]);

            // Intro finished
            document.body.style.overflow = "";
            setIntroComplete(true);
        };

        seq();
        return () => {
            document.body.style.overflow = "";
        };
    }, [
        introDraw,
        introFill,
        introBlackBg,
        introLogoScale,
        introLogoOpacity,
        introLogoX,
        introLogoY,
    ]);

    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth < 480);
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const [scrollY, setScrollY] = useState(0);

    // Holographic Carousel State
    const [holoIndex, setHoloIndex] = useState(0);
    const [isHoloFlickering, setIsHoloFlickering] = useState(false);
    const holoImages = [infra, robowars, image2, image3];

    // ================== SCROLL SECTION 1: Earth & YT Reveal ==================
    const earthYTRef = useRef(null);
    const { scrollYProgress: earthProg } = useScroll({
        target: earthYTRef,
        offset: ["start start", "end end"],
    });

    const earthScale = useTransform(earthProg, [0, 0.6], [1, 20]);
    const holeRadius = useTransform(earthProg, [0.1, 0.6], ["-5%", "150%"]);
    const earthMaskImage = useMotionTemplate`radial-gradient(circle, transparent ${holeRadius}, black calc(${holeRadius} + 15%))`;

    // Explicit scale and slide up for YouTube video appearing gracefully behind earth
    const ytOpacity = useTransform(earthProg, [0.15, 0.2], [0, 1]);
    const ytScale = useTransform(earthProg, [0, 0.3], [0.8, 1]);
    const ytY = useTransform(earthProg, [0.3, 0.6], [50, 0]);

    // ================== SCROLL SECTION 2: Categories 3D Helix ==================
    const helixRef = useRef(null);
    const { scrollYProgress: helixProg } = useScroll({
        target: helixRef,
        offset: ["start start", "end end"],
    });

    // Smooth out the scroll progress natively for a butter-smooth effect
    const smoothHelixProg = useSpring(helixProg, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    const numCards = departments.length; // 13
    const spacing = 120; // Distance vertically between cards

    // Map scroll progress (0 to 1) to Y position and Rotation
    const totalYDistance = (numCards - 1) * spacing;
    const totalRotation = (numCards - 1) * 45;

    const helixContainerY = useTransform(
        smoothHelixProg,
        [0, 1],
        [0, -totalYDistance],
    );
    const helixContainerRotateY = useTransform(
        smoothHelixProg,
        [0, 1],
        [0, -totalRotation],
    );

    // ================== MISC EFFECTS ==================
    // Carousel Timing Logic
    useEffect(() => {
        const carouselInterval = setInterval(() => {
            setIsHoloFlickering(true);
            setTimeout(() => {
                setHoloIndex((prev) => (prev + 1) % holoImages.length);
            }, 200);
            setTimeout(() => {
                setIsHoloFlickering(false);
            }, 400);
        }, 2400);
        return () => clearInterval(carouselInterval);
    }, [holoImages.length]);

    // Background Stars
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
        }));
    }, []);

    // Global Scroll Effect
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Initialize Particles.js
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

    // ================== IMAGE TRAIL EFFECT TRACKING ==================
    const [trailItems, setTrailItems] = useState([]);
    const lastPos = useRef({ x: 0, y: 0 });
    const imgIndex = useRef(0);
    const nextId = useRef(0);
    const holdTimer = useRef(null);
    const currentPointerPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        return () => {
            if (holdTimer.current) clearInterval(holdTimer.current);
        };
    }, []);

    const displayDuration = isMobile ? 1500 : 1000; // ms before fading out
    const minDistance = isMobile ? 800 : 200; // px distance before spawning next image

    const handleRemove = useCallback((idToRemove) => {
        setTrailItems((prev) => prev.filter((item) => item.id !== idToRemove));
    }, []);

    const createTrailImage = (localX, localY) => {
        const newImage = {
            id: nextId.current++,
            x: localX,
            y: localY,
            src: trailImagesData[imgIndex.current % trailImagesData.length],
        };
        imgIndex.current++;
        setTrailItems((prev) => [...prev, newImage]);
    };

    const spawnImage = (localX, localY) => {
        const distance = Math.hypot(
            localX - lastPos.current.x,
            localY - lastPos.current.y,
        );

        if (
            distance >= minDistance ||
            (lastPos.current.x === 0 && lastPos.current.y === 0)
        ) {
            lastPos.current = { x: localX, y: localY };
            createTrailImage(localX, localY);
        }
    };

    const handlePointerDown = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        currentPointerPos.current = { x, y };
        lastPos.current = { x, y };

        createTrailImage(x, y);

        if (holdTimer.current) clearInterval(holdTimer.current);
        holdTimer.current = setInterval(() => {
            createTrailImage(
                currentPointerPos.current.x,
                currentPointerPos.current.y,
            );
        }, 150);

        try {
            e.target.setPointerCapture(e.pointerId);
        } catch (err) {}
    };

    const handlePointerMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        currentPointerPos.current = { x, y };
        spawnImage(x, y);
    };

    const handlePointerUp = (e) => {
        if (holdTimer.current) clearInterval(holdTimer.current);
        try {
            e.target.releasePointerCapture(e.pointerId);
        } catch (err) {}
    };

    const heroOpacity = Math.max(0, 1 - scrollY / 600);
    const heroYOffset = scrollY * 0.3;

    return (
        <div className="bg-slate-950 text-white min-h-screen font-sans relative selection:bg-indigo-500/30 overflow-clip">
            <style>{`
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
                .star-wrapper:hover { z-index: 2; }
                .star-wrapper:hover .interactive-star {
                    transform: translate(calc(-50% + var(--hx)), calc(-50% + var(--hy))) scale(2.5);
                    background-color: #818cf8;
                    box-shadow: 0 0 15px #818cf8;
                    opacity: 1 !important;
                }

                /* HOLOGRAPHIC CAROUSEL CSS */
                .holo-container { perspective: 1200px; transform-style: preserve-3d; }
                .holo-3d-tilt {
                    transform: rotateY(-30deg) translateZ(-50px);
                    transform-style: preserve-3d;
                    transform-origin: right center;
                }
                .holo-scanlines {
                    position: absolute; inset: 0;
                    background: linear-gradient(to bottom, transparent 50%, rgba(0, 255, 255, 0.15) 51%);
                    background-size: 100% 4px; pointer-events: none; z-index: 10;
                }
                .holo-idle-float { animation: holo-float 4s ease-in-out infinite, holo-pulse 3s infinite alternate; }
                .holo-flicker-anim { animation: holo-glitch 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
                @keyframes holo-float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
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
                    position: absolute; bottom: -40px; left: 60%;
                    transform: translateX(-50%) rotateX(75deg); width: 180px; height: 180px;
                    background: radial-gradient(circle, rgba(0,255,255,0.7) 0%, transparent 60%);
                    filter: blur(8px); opacity: 0.7; pointer-events: none;
                }

                .earth-image { position: absolute; width: 110vmin; height: 110vmin; object-fit: cover; pointer-events: none; }

                .holo-green-card {
                    background: rgba(10, 38, 68, 0.82);
                    border: 1px solid rgba(65, 132, 255, 0.7);  // Deep blue border
               
               
                    backdrop-filter: blur(22px);
                    box-shadow: 
                        0 0 25px rgba(59, 191, 255, 0.3), 
                        inset 0 0 15px rgba(59, 191, 255, 0.2),
                        0 25px 50px -12px rgba(0, 0, 0, 0.5);
                   
                    position: relative;
                    overflow: hidden;
                    border-radius: 1rem;
                    transition: all 0.3s ease;
                }
                .holo-green-card:hover {
                    box-shadow: 
                        0 0 40px rgba(59, 191, 255, 0.6), 
                        inset 0 0 25px rgba(59, 191, 255, 0.4),
                        0 25px 50px -12px rgba(0, 0, 0, 0.6);
                    border-color: rgba(59, 191, 255, 0.9);
               
                }
                
                /* =========================================
                   IMAGE TRAIL SECTION CSS
                   ========================================= */
                .trail-container {
                    height: 100vh;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    z-index: 10;
                    background-color: #0b0c10;
                    overflow: hidden; /* Essential: keeps spawned images inside this section */
                }

                .trail-title {
                    color: #ffffff;
                    font-size: clamp(2rem, 6vw, 4rem);
                    font-weight: 700;
                    letter-spacing: -0.04em;
                    text-align: center;
                    pointer-events: none;
                    z-index: 20;
                    text-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }

                .trail-image {
                    position: absolute;
                    width: clamp(220px, 25vw, 250px);
                    height: clamp(150px, 15vw, 350px);
                    object-fit: cover;
                    border-radius: 12px;
                    pointer-events: none;
                    transform: translate(-50%, -50%) scale(0.5);
                    opacity: 0;
                    z-index: 1;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                    transition: opacity 0.4s ease, transform 0.4s ease;
                }

                .trail-image.active {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }

                .trail-image.fade-out {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8);
                }
            `}</style>

            {/* ================= INTRO LOADING OVERLAY ================= */}
            <motion.div
                className={`fixed inset-0 z-[100] flex items-center justify-center bg-black ${introComplete ? "pointer-events-none" : ""}`}
                style={{ opacity: introBlackBg }}
            >
                <motion.div
                    className="relative w-64 md:w-96"
                    style={{
                        x: introLogoX,
                        y: introLogoY,
                        scale: introLogoScale,
                        opacity: introLogoOpacity,
                    }}
                >
                    <Logo draw={introDraw} fillOpacity={introFill} />
                </motion.div>
            </motion.div>

            {/* Stars Background */}
            <motion.div className="fixed inset-0 pointer-events-none star-pattern z-0 opacity-50"></motion.div>
            <motion.div
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
            </motion.div>

            {/* ================= SOCIAL MEDIA FLOATING PANE ================= */}
            {!isMobile && (
                <div className="fixed top-1/2 right-4 md:right-6 -translate-y-1/2 z-[90] flex flex-col gap-3 p-3 rounded-full glass-panel shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                    {socialLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            title={link.name}
                            className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-indigo-500/30 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                        >
                            {link.icon}
                        </a>
                    ))}
                </div>
            )}

            {/* ================= HERO SECTION ================= */}
            <section className="relative min-h-screen py-32 md:py-0 md:min-h-screen w-full flex items-center px-6 sm:px-8 md:px-24 z-10 overflow-hidden pointer-events-none">
                <div
                    id="particles-hero"
                    className="absolute inset-0 z-0 pointer-events-auto"
                    style={{ opacity: heroOpacity, willChange: "opacity" }}
                ></div>

                <div
                    className={`flex ${isMobile ? "flex-col" : "flex-row"} w-full items-center justify-between pointer-events-auto relative z-20 max-w-7xl mx-auto gap-12`}
                    style={{ pointerEvents: "none" }}
                >
                    <div
                        className="flex flex-col items-center text-center md:items-start md:text-left w-full md:w-1/2 max-w-2xl"
                        style={{
                            opacity: heroOpacity,
                            transform: `translateY(${heroYOffset}px)`,
                            willChange: "opacity, transform",
                        }}
                    >
                        <h1
                            className={`${isMobile ? "text-5xl sm:text-6xl" : "text-lg sm:text-3xl md:text-4xl lg:text-5xl"} font-black leading-tight mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-500`}
                            style={{ pointerEvents: "auto" }}
                        >
                            Welcome to <br /> Techfest
                        </h1>
                        <p
                            className="text-slate-400 max-w-lg text-sm sm:text-base md:text-lg mb-8"
                            style={{ pointerEvents: "auto" }}
                        >
                            Techfest IIT Bombay is a transformative experience
                            and Asia's largest science and tech festival. It's
                            your chance to hone skills, network with industry
                            leaders, and gain global exposure. Meet peers and
                            professionals from around the world, enjoy Ozone
                            activities, and witness electrifying TechX
                            performances. Join us and be part of something
                            extraordinary!
                        </p>
                    </div>

                    <div
                        className="holo-container w-full md:w-1/2 max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto mt-16 md:mt-0 flex-shrink-0"
                        style={{
                            opacity: heroOpacity,
                            transform: `translateY(${heroYOffset * 1.1}px)`,
                            willChange: "opacity, transform",
                            minHeight: !isMobile ? "380px" : "auto",
                        }}
                    >
                        <div
                            className="holo-3d-tilt relative w-full h-48 sm:h-56 md:h-64 lg:h-72"
                            style={isMobile ? { aspectRatio: "16/9" } : {}}
                        >
                            <div
                                className={`absolute inset-0 rounded-xl border border-cyan-400/60 bg-cyan-950/80 overflow-hidden ${isHoloFlickering ? "holo-flicker-anim" : "holo-idle-float"}`}
                            >
                                <img
                                    src={holoImages[holoIndex]}
                                    alt="Techfest Holographic Display"
                                    className="w-full h-full object-cover opacity-80 mix-blend-screen filter sepia hue-rotate-180 saturate-200 contrast-125"
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                    }}
                                />
                                <div className="absolute inset-0 bg-cyan-400/20 mix-blend-color"></div>
                                <div className="holo-scanlines"></div>
                            </div>
                        </div>
                        <div className="holo-projector-base"></div>
                    </div>
                </div>

                {/* Scroll Down Indicator */}
                <div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto opacity-80"
                    style={{
                        opacity: heroOpacity, // Fades out alongside the hero content if desired
                        willChange: "opacity",
                    }}
                >
                    <span className="text-slate-400 text-xs sm:text-sm uppercase tracking-widest mb-2 font-medium">
                        Scroll down
                    </span>
                    <svg
                        className="w-5 h-5 text-indigo-400 animate-bounce"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
                </div>
            </section>

            {/* ================= SCROLL SECTION 1: Earth & YT (200vh) ================= */}
            <div ref={earthYTRef} className="relative z-10 h-[200vh]">
                <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
                    <motion.div
                        className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-24 z-0 pointer-events-auto"
                        style={{ opacity: ytOpacity, scale: ytScale, y: ytY }}
                    >
                        {/* 1. Added [perspective:1200px] to the parent to enable 3D space 
      2. Removed overflow-hidden here so the 3D corners don't get clipped 
    */}
                        <div className="w-full max-w-5xl [perspective:3200px] relative z-30">
                            {/* flex-col for mobile (stacked), md:flex-row for desktop (side-by-side) */}
                            <div className="flex flex-col md:flex-row w-full gap-6 md:gap-10 items-center justify-center">
                                <div className="w-full md:w-1/2 aspect-video rounded-2xl overflow-hidden glass-panel border border-indigo-500/20 shadow-[0_0_50px_rgba(99,102,241,0.15)] transition-transform duration-500 [transform:rotateX(-10deg)] md:[transform:rotateY(-15deg)_rotateX(0deg)] hover:[transform:rotateX(0deg)_rotateY(0deg)] relative">
                                    <iframe
                                        className="w-full h-full absolute inset-0"
                                        src="https://www.youtube.com/embed/Ml_fnnOmF0Q"
                                        title="YouTube video player 2"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                                <div className="w-full md:w-1/2 aspect-video rounded-2xl overflow-hidden glass-panel border border-indigo-500/20 shadow-[0_0_50px_rgba(99,102,241,0.15)] transition-transform duration-500 [transform:rotateX(10deg)] md:[transform:rotateY(15deg)_rotateX(0deg)] hover:[transform:rotateX(0deg)_rotateY(0deg)] relative">
                                    <iframe
                                        className="w-full h-full absolute inset-0"
                                        src="https://www.youtube.com/embed/0_FBwJi8VBo"
                                        title="YouTube video player 1"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.img
                        src="https://www.transparentpng.com/download/earth/QzJqcJ-earth-clipart-png-earth-clipart-png-image-free-download.png"
                        alt="Earth"
                        className="earth-image z-20 pointer-events-none"
                        style={{
                            scale: earthScale,
                            maskImage: earthMaskImage,
                            WebkitMaskImage: earthMaskImage,
                        }}
                    />
                </div>
            </div>

            {/* ================= SCROLL SECTION 2: 3D Helix Categories (500vh) ================= */}
            <div
                ref={helixRef}
                className="relative w-full h-[500vh] bg-black z-20"
            >
                <div
                    className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden"
                    style={{ perspective: "1200px" }}
                >
                    {/* Contrasting Background Glows */}
                    <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-50 mix-blend-screen">
                        <div className="w-[50vw] h-[50vw] rounded-full blur-[120px] absolute -translate-x-1/4 -translate-y-1/4" />
                        <div className="w-[50vw] h-[50vw] rounded-full blur-[120px] absolute translate-x-1/4 translate-y-1/4" />
                    </div>

                    <div className="absolute z-0 flex flex-col items-center justify-center pointer-events-none opacity-40">
                        <h1
                            className="text-4xl md:text-6xl font-bold text-white text-center tracking-widest z-10"
                            style={{ transform: "translateY(-164px)" }}
                        >
                            Departments
                        </h1>
                    </div>

                    {/* Scroll Progress Bar for Helix */}
                    <div className="absolute left-8 top-1/4 bottom-1/4 w-1 bg-zinc-800 rounded-full overflow-hidden z-10 hidden md:block">
                        <motion.div
                            className="w-full h-full bg-white origin-top"
                            style={{ scaleY: smoothHelixProg }}
                        />
                    </div>

                    {/* Centered wrapper for 3D Helix */}
                    <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{
                                transformStyle: "preserve-3d",
                                y: helixContainerY,
                                rotateY: helixContainerRotateY,
                            }}
                        >
                            {departments.map((item, i) => {
                                const yPos = i * spacing;
                                const rotateY = i * 45;
                                return (
                                    <div
                                        key={item.id}
                                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                        style={{
                                            transformStyle: "preserve-3d",
                                            transform: `translateY(${yPos}px) rotateY(${rotateY}deg) translateZ(calc(300px + 30vw))`,
                                        }}
                                    >
                                        {!isMobile ? (
                                            <motion.div
                                                className="holo-green-card w-[85vw] sm:w-[60vw] md:w-[620px] h-[260px] md:h-[360px] flex flex-row pointer-events-auto cursor-grab active:cursor-grabbing group"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 400,
                                                    damping: 25,
                                                }}
                                            >
                                                <div className="w-2/5 h-full relative shrink-0 p-2 md:p-3 z-10">
                                                    <img
                                                        src={item.image}
                                                        alt={item.department}
                                                        className="w-full h-full object-cover rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                                                        draggable="false"
                                                        style={{ zIndex: i }}
                                                    />
                                                </div>

                                                <div className="w-3/5 p-2 md:p-4 flex flex-col justify-center z-10">
                                                    <h3 className="text-clip md:text-xl font-bold text-white mb-1 md:mb-2 tracking-wider truncate">
                                                        {item.department}
                                                    </h3>
                                                    <p className="text-white text-[10px] md:text-sm leading-snug">
                                                        {item.content}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                className="holo-green-card w-[78vw] sm:w-[60vw] md:w-[620px] h-[400px] md:h-[360px] flex flex-col pointer-events-auto cursor-grab active:cursor-grabbing group"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 400,
                                                    damping: 25,
                                                }}
                                            >
                                                <div className="w-full h-2/5 relative shrink-0 p-2 md:p-3 z-10">
                                                    <img
                                                        src={item.image}
                                                        alt={item.department}
                                                        className="w-full h-full object-cover rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                                                        draggable="false"
                                                        style={{ zIndex: i }}
                                                    />
                                                </div>

                                                <div className="w-full p-2 md:p-4 flex flex-col justify-center z-10">
                                                    <h3 className="text-clip md:text-xl font-bold text-white mb-1 md:mb-2 tracking-wider truncate">
                                                        {item.department}
                                                    </h3>
                                                    <p className="text-white text-[12px] md:text-sm leading-snug">
                                                        {item.content}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                );
                            })}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* ================= PAST YEAR HIGHLIGHTS (IMAGE TRAIL) ================= */}
            <section
                className="trail-container pointer-events-auto"
                style={{ touchAction: "none" }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
            >
                <div className="flex flex-col">
                    <h1 className="trail-title">Past Year Coordi Memories</h1>
                    <p style={{ pointerEvents: "none" }}>
                        Hover with cursor over the screen or hold & press the
                        screen on mobile to experience Techfest highlights
                    </p>
                </div>

                {trailItems.map((item) => (
                    <TrailImage
                        key={item.id}
                        id={item.id}
                        x={item.x}
                        y={item.y}
                        src={item.src}
                        onComplete={handleRemove}
                        displayDuration={displayDuration}
                    />
                ))}
            </section>
        </div>
    );
}
