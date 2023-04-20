import React, {useEffect, useState} from 'react';
import './Styles/ProfilePage.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Styles/ProfilePage.module.css';
import {IUser} from "./models";
import User from "./User";
import {Link} from "react-router-dom";
import {getProfile} from "./ProfileService";
import { useDispatch } from 'react-redux';
export default function ProfilePage(){
    const requestUrl = `http://127.0.0.1:5000/api/v1/user/${sessionStorage.getItem('username')}`;
    const [user, setUser] = useState<IUser>();
    const dispatch = useDispatch();
    useEffect(() => {
        getProfile(requestUrl).then((data) => {
            dispatch({ type: 'LOGIN' });
            const user : IUser = data;
            console.log(data)
            setUser(user)
        });
    }, [])

    function logout() {
        dispatch({ type: 'LOGOUT' });
    }
    return (
        <div className={styles["body-div"]}>
        <div className={styles["custom-container"]}>
        {user && <User user={user}/>}
            <div className={styles["profile-details"]}>
                <Link to="/profile"><button className={styles["custom-button"]}>Edit my profile!</button></Link>
                <Link to="/profile"><button className={styles["custom-button"]}>See my events!</button></Link>
                <Link to="/"><button className={`${styles["custom-button"]} ${styles["delete-button"]}`} onClick={logout}>Logout!</button></Link>
            </div>
            </div>
        </div>
    )
}

