import React, {useEffect, useState} from 'react';
import '../Styles/ProfilePage.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../Styles/ProfilePage.module.css';
import {IUser} from "../models";
import User from "../User";
import {Link} from "react-router-dom";
import {getProfile} from "./ProfileService";
import { useDispatch } from 'react-redux';
import Loading from "../Loading";
export default function ProfilePage(){
    const requestUrl = `http://127.0.0.1:5000/api/v1/user/${sessionStorage.getItem('username')}`;
    const [user, setUser] = useState<IUser>();
    const [isLoading, setIsLoading] = useState(true)
    const dispatch = useDispatch();
    useEffect(() => {
        getProfile(requestUrl).then((data) => {
            setIsLoading(true)
            dispatch({ type: 'LOGIN' });
            const user : IUser = data;
            sessionStorage.setItem("role", user.role)
            setUser(user)
            setIsLoading(false)
        });
    }, [])

    function logout() {
        dispatch({ type: 'LOGOUT' });
        sessionStorage.clear()
    }
    return (
        <div className={styles["body-div"]}>
            {isLoading ? <Loading color="white"/> : (<div className={styles["custom-container"]}>
        {user && <User user={user}/>}
            <div className={styles["profile-details"]}>
                <Link to="/profile"><button className={styles["custom-button"]}>Edit my profile!</button></Link>
                <Link to="/events"><button className={styles["custom-button"]}>See my events!</button></Link>
                {user?.role === 'admin' && <Link to="/admin"><button className={`${styles["custom-button"]}`}>⚙️</button></Link>}
                <Link to="/"><button className={`${styles["custom-button"]} ${styles["delete-button"]}`} onClick={logout}>Logout!</button></Link>
            </div>
            </div>
        )}
        </div>
    )
}

