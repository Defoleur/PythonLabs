import React from "react";
import styles from "../Styles/MainPage.module.scss"
import {Link} from "react-router-dom";

interface ErrorProps{
    code: number,
    error: string,
    text: string
}
export default function ErrorPage({code, error, text} : ErrorProps){
    return (
        <div className={styles.body}>
        <div className={styles.main}>
    <div className={styles['main-div']}>
        <h1 className={styles.h1}>{code}</h1>
        <h2 className={styles.h2}>{error}</h2>
        <label className={styles.label}>{text} </label>
        <Link to="/">Go to main page!</Link>
    </div>
    </div>
    </div>
    )
}
