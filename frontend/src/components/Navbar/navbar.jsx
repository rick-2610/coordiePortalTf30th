import React from "react";
import styles from "./navbar.module.css";
import logo from "../../assets/home/logo.svg";
import smalllogo from "../../assets/home/smalllogo.png";

const Navbar = () => {
    return (
        <div className={styles.navbar}>
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

            <div className={styles.navoptions}>
                <div className={styles.homebtn}>
                    <a href="/" className={styles.home}>
                        HOME
                    </a>
                    <div className={styles.line}></div>
                </div>

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
            </div>
        </div>
    );
};

export default Navbar;
