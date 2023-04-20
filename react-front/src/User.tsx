import React from "react";
import {IUser} from "./models";
import styles from './Styles/ProfilePage.module.scss';
import Avatar from "./mikey.png"

interface UserProps{
    user: IUser
}

export default function User({user}: UserProps){
     return (
    <div>
        <div className={styles["centered-div"]}>
            <div>
                <img className={styles["profile-avatar"]} src={Avatar} alt="My Profile Picture"/>
            </div>
            <div className={styles["profile-name"]} id="name">{user.firstName} {user.lastName}</div>
        </div>
        <div className={styles["profile-details"]}>
            <div className={styles["profile-bio"]}>
                <label className={`${styles["profile-attribute"]} ${styles["text"]}`}>Username:</label>
                <label className={`${styles["profile-data"]} ${styles["text"]}`} id="username-profile">{user.username}</label>
            </div>
            <div className={styles["profile-bio"]}>
                <label className={`${styles["profile-attribute"]} ${styles["text"]}`}>Email:</label>
                <label className={`${styles["profile-data"]} ${styles["text"]}`} id="email">{user.email}</label>
            </div>
            <div className={styles["profile-bio"]}>
                <label className={`${styles["profile-attribute"]} ${styles["text"]}`}>Phone:</label>
                <label className={`${styles["profile-data"]} ${styles["text"]}`} id="phone">{user.phone}</label>
            </div>
            <div className={styles["profile-bio"]}>
                <label className={`${styles["profile-attribute"]} ${styles["text"]}`}>Role:</label>
                <label className={`${styles["profile-data"]} ${styles["text"]}`} id="role">{user.role}</label>
            </div>
        </div>
    </div>
    )
}
