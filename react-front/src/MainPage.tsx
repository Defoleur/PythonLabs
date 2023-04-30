import React from "react";
import styles from "./Styles/MainPage.module.scss"

export default function MainPage(){
    return (
        <div className={styles.body}>
            <div className={styles.main}>
                <div className={styles['main-div']}>
                    <h1 className={styles.h1}>EventCD</h1>
                    <label className={styles.label}>Convenient app for your event planning.</label>
                </div>
            </div>
        </div>
    )
}
