import React, {useEffect, useState} from "react";
import styles from "../Styles/EventInfoPage.module.scss";
import list_styles from "../Styles/UserList.module.scss";
import edit_styles from "../Styles/EditEventPage.module.scss"
import {useNavigate, useParams} from "react-router-dom";
import {IEvent, IUser} from "../models";
import getInfo from "./InfoService";
import Avatar from "../mikey.png";
import {User} from "./User";
import DeleteInfo from "./DeleteService";
import Loading from "../Loading";
import AddUserToEvent from "./UserService";


export default function EventInfoPage() {
    const { id } = useParams();
    const [event, setEvent] = useState<IEvent>();
    const [users, setUsers] = useState<IUser[]>();
    const [userToAdd, setUserToAdd] = useState<IUser>();
    const [isLoading, setIsLoading] = useState(true);
    const [username, setUsername] = useState('')
    const eventUrl = `http://127.0.0.1:5000/api/v1/event/${id}`;
    const getUsersUrl = `http://127.0.0.1:5000/api/v1/${id}/users`;
    const navigation = useNavigate();
    useEffect(() => {
        getInfo(eventUrl).then((data) => {
            setIsLoading(true)
            const event : IEvent = data
            console.log(event)
            setEvent(event)
            setIsLoading(false)
        })
        getInfo(getUsersUrl).then((data) => {
            setIsLoading(true)
            const users : IUser[] = data
            console.log(users)
            setUsers(users)
            setIsLoading(false)
        })
    }, [])
    async function deleteEvent(){
        try {
      await DeleteInfo(eventUrl).then(() => navigation('/events'));
        alert("Event was successfully deleted!")
    } catch (error : any) {
      console.error(error);
    }
    }
    async function findUser(){
        const requestUrl = `http://127.0.0.1:5000/api/v1/user/${username}`;
        getInfo(requestUrl).then((data) => {
            const user : IUser = data
            console.log(user)
            setUserToAdd(user)
        })
    }
    async function addUser(){
        const body = {
            event : event?.id,
            user : userToAdd?.id
        }
        const requestUrl = `http://127.0.0.1:5000/api/v1/event/user`;
        AddUserToEvent(requestUrl, body).then(() => {
            getInfo(getUsersUrl).then((data) => {
            setIsLoading(true)
            const users : IUser[] = data
            console.log(users)
            setUsers(users)
            setIsLoading(false)
                setUserToAdd(undefined)
        })}
        )

    }
    async function deleteUser(username : string){
        const requestUrl = `http://127.0.0.1:5000/api/v1/event/${event?.id}/${username}`;
        DeleteInfo(requestUrl).then(() => {
            getInfo(getUsersUrl).then((data) => {
            setIsLoading(true)
            const users : IUser[] = data
            console.log(users)
            setUsers(users)
            setIsLoading(false)
        })})
    }
    return (<body className={styles.body}>
    {isLoading ? (
  <Loading color="white" />) : (
        <div className={styles["custom-container"]}>
        {event && (
            <div className={styles["event-details"]}>
            <div className={styles["event-name"]} id="event-name">{event.title}</div>
            <hr className={styles.hr}/>
                <div className="row gx-5">
                    <div className="col-md-6">
                            <div className={styles["event-owner"]}>
                      Owner: <img className={styles["profile-pic"]} src={`https://picsum.photos/299`} alt="My Profile Picture"/> {event.username}</div>
                   <div className={styles["event-date"]}>Date 📅: {event.date}</div>
                   <div className={styles["event-date"]}>Time 🕰️: {event.startTime} - {event.endTime}</div>
                  <div className={styles["event-description"]}>Description: {event.content}</div>
              </div>
                    <div className="col-md-6">
                         {event?.username === sessionStorage.getItem("username") &&
                             <>
                    <div className={edit_styles["edit-div"]}>
                        <input
                    type="text"
                    name="title"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Search by username..."/>
                        <button className={styles["custom-button"]} onClick={findUser}>Search!</button>
                    </div>
                        {userToAdd &&  <li className={list_styles["user-container"]}>
                            <User user={userToAdd}/>
                            <div className={list_styles["buttons-div"]}>
                            <button className={`${styles["custom-button"]} my-2 btn`} onClick={addUser}>+</button>
                            </div>
                            </li>}
                         </>}
                        <div className={styles["event-owner"]}>Attached to:</div>
                        <ul className={list_styles["user-list"]}>
                        {users && (users?.length > 0 ? (<>
                                {users.map((user : IUser) => (
                                    <li className={list_styles["user-container"]}>
                                    <User user={user}/>
                                        {event?.username === sessionStorage.getItem("username") &&
                                       <div className={list_styles["buttons-div"]}>
                            <button className={`${styles["custom-button"]} my-2 btn`} onClick={() => deleteUser(user.username)}>-</button>
                            </div>}
                            </li>)
                                )}
                                </>): <li>
                            <div className={list_styles["empty"]}>
                            There are not any users 😕
                            </div>
                            </li>)
                        }
                        </ul>
                    </div>
                </div>
                </div>)}
            {event?.username === sessionStorage.getItem("username") &&
                <div>
                    {/*<button className={styles["custom-button"]}>Add users!</button>*/}
                    <button className={`${styles["custom-button"]} ${styles["delete-button"]}`} onClick={deleteEvent}>Delete this event!</button>
                </div>
                 }
        </div>)
    }
        </body>)
}

