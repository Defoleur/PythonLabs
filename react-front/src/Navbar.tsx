import React from "react";
import {Link, useInRouterContext} from "react-router-dom";
import styles from "./Styles/Navbar.module.css"
import Avatar from "./mikey.png"
import {useSelector} from "react-redux";

type AppState = {
  isLoggedIn: boolean;
};

const Navbar = () => {
    const isLoggedIn = useSelector((state:AppState) => state.isLoggedIn);
    return (
        <div>
            {!isLoggedIn ? (
                    <nav className={`${styles['navbar-custom']} navbar navbar-expand-sm navbar-light rounded-bottom bg-white justify-content-between fixed-top`}>
                        <div className="navbar-nav navbar-nav-right ml-auto">
                           <a className={`${styles['navbar-brand']} navbar-brand`}><Link className={styles.link} to={'/'}>EventCD🗓️</Link></a>
                        </div>
                        <button className="navbar-toggler" data-bs-toggle="collapse"
                                data-target="#info" aria-controls="info"
                                aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div id="info" className="navbar-nav ml-auto">
                            <a className="nav-item nav-link"><Link className={styles.link} to={'/login'}>Login</Link></a>
                            <a className="nav-item nav-link"><Link className={styles.link} to={'/registration'}>Registration</Link></a>
                        </div>
                    </nav>
                ) :
                (<nav className={`${styles['navbar-custom']} navbar navbar-expand-sm navbar-light rounded-bottom bg-white justify-content-between fixed-top`}>
                    <div className="navbar-nav mr-auto">
                        <a className={`${styles['navbar-brand']} navbar-brand`}><Link className={styles.link} to={'/'}>EventCD🗓️</Link></a>
                        <a className="nav-item nav-link">Add new event!</a>
                        <a className="nav-item nav-link"><Link className={styles.link} to={'/events'}>Search for events!</Link></a>
                    </div>
                    <div className="navbar-nav ml-auto">
                        <a className="nav-item nav-link"><img className={styles["profile-pic"]} src={Avatar} alt="My Profile Picture"/></a>
                        <a className="nav-item nav-link"><Link className={styles.link} to={'/profile'}>{sessionStorage.getItem('username')}</Link></a>
                    </div>
                </nav>)
            }
        </div>
    )
};

export default Navbar;

