import React from "react";
import {Link, useInRouterContext} from "react-router-dom";
import styles from "./Styles/Navbar.module.css"
import Avatar from "./mikey.png"

export default function NavbarNotLogged() {
    return (
        <nav className={`${styles['navbar-custom']} navbar navbar-expand-sm navbar-light rounded-bottom bg-white justify-content-between fixed-top`}>
            <div className="navbar-nav navbar-nav-right ml-auto">
                <a className={`${styles['navbar-brand']} navbar-brand`}>EventCD🗓️</a>
            </div>
            <div className="navbar-nav ml-auto">
                <a className="nav-item nav-link"><Link className={styles.link} to={'/login'}>Login</Link></a>
                <a className="nav-item nav-link"><Link className={styles.link} to={'/registration'}>Registration</Link></a>
            </div>
        </nav>)
};




