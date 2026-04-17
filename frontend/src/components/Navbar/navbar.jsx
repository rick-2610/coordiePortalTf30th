import React from "react";
import { useState, useEffect, useRef } from "react";
import styles from "./navbar.module.css";
import logo from "../../assets/home/logo.svg";
import smalllogo from "../../assets/home/smalllogo.png";
import { redirect } from "react-router";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
    // const [burger_class,setBurgerClass] = useState("burger-bar unclicked");
    // const [menu_class,setMenuClass] = useState("menu hidden");
    // const [isMenuClicked, setMenuClicked] = useState(false).

    // const updateMenu = () =>{

    //   if(isMenuClicked){
    //     setBurgerClass("burger-class clicked");
    //     setMenuClass("menu visible");
    //   }
    //   else{
    //     setBurgerClass("burger-class unclicked");
    //     setMenuClass("menu hidden"); https://docs.google.com/forms/d/e/1FAIpQLSdVe12ycF4e3YMwWttzOa29fjhhW_5rez1FfrQfUBMtgUYGnQ/viewform
    //   }

    // }
    const navRef = useRef();

    const showNavbar = () => {
        navRef.current.classList.toggle(styles.responsive_nav);
    };

    const closeNavbar = () => {
        navRef.current.classList.remove(styles.responsive_nav);
    };

    return (
        <div className={styles.navbar}>
            <a className={styles.logo} href="https://techfest.org/">
                <img
                    src={logo}
                    className={styles.image}
                    id={styles.image1}
                ></img>
                <img
                    src={smalllogo}
                    className={styles.image}
                    id={styles.image2}
                ></img>
            </a>
            <div className={styles.navoptions} ref={navRef}>
                <div className={styles.homebtn}>
                    <a href="/" className={styles.home}>
                        HOME
                    </a>
                    <div className={styles.line}></div>
                </div>
                {/* <div className={styles.deptbtn}>
                    <a href="/verticals" className={styles.dept}>
                        DEPARTMENTS
                    </a>
                    <div className={styles.line}></div>
                </div> */}
                <div className={styles.deptbtn}>
                    <a href="/game" className={styles.dept}>
                        FLAPPY GAME
                    </a>
                    <div className={styles.line}></div>
                </div>
                <div className={styles.regbtn}>
                    <a href="/form" className={styles.reg}>
                        REGISTER
                    </a>
                    <div className={styles.line}></div>
                </div>
                <button
                    className={styles.navbtn}
                    id={styles.navclosebtn}
                    onClick={showNavbar}
                >
                    <FaTimes />
                </button>
            </div>
            <button onClick={showNavbar} className={styles.navbtn}>
                <FaBars />
            </button>
        </div>
    );
};

export default Navbar;
