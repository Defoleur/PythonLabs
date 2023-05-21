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
import ErrorMessageProvider from "../ErrorMessageProvider";
import {Alert} from "react-bootstrap";


export default function EventInfoPage() {
    const { id } = useParams();
    const [event, setEvent] = useState<IEvent>();
    const [users, setUsers] = useState<IUser[]>();
    const [userToAdd, setUserToAdd] = useState<IUser>();
    const [isLoading, setIsLoading] = useState(true);
    const [username, setUsername] = useState('')
    const [showAlert, setShowAlert] = useState(false);
    const [textAlert, setTextAlert] = useState("");
    const eventUrl = `http://127.0.0.1:5000/api/v1/event/${id}`;
    const getUsersUrl = `http://127.0.0.1:5000/api/v1/${id}/users`;
    const navigation = useNavigate();
    useEffect(() => {
        getInfo(eventUrl).then((data) => {
            setIsLoading(true)
            const event : IEvent = data
            setEvent(event)
            setIsLoading(false)
        })
        getInfo(getUsersUrl).then((data) => {
            setIsLoading(true)
            const users : IUser[] = data
            setUsers(users)
            setIsLoading(false)
        })
    }, [])
    async function deleteEvent(){
        console.log("hello")
        DeleteInfo(eventUrl).then(() => {
              navigation('/events')
              alert("Event was successfully deleted!")
          }).catch((error) => {
          })
    }
    async function findUser(){
        setUserToAdd(undefined)
        const requestUrl = `http://127.0.0.1:5000/api/v1/user/${username}`;
        getInfo(requestUrl).then((data) => {
            setShowAlert(false);
            const user : IUser = data
            setUserToAdd(user)
        }).catch ((error) => {
            setTextAlert(`User with username ${username} wasn't found!`)
            setShowAlert(true);
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
            setUsers(users)
            setIsLoading(false)
                setUserToAdd(undefined)
                setUsername("")
        })}
        ).catch((error) => {
            setTextAlert(error.message)
            setShowAlert(true);
        })

    }
    async function deleteUser(username : string){
        const requestUrl = `http://127.0.0.1:5000/api/v1/event/${event?.id}/${username}`;
        DeleteInfo(requestUrl).then(() => {
            getInfo(getUsersUrl).then((data) => {
            setIsLoading(true)
            const users : IUser[] = data
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
            <div className={styles["event-name"]} id="event-name" aria-label="event-name">{event.title}</div>
            <hr className={styles.hr}/>
                <div className="row gx-5">
                    <div className="col-md-6">
                            <div className={styles["event-owner"]} aria-label="username">
                      Owner: <img className={styles["profile-pic"]} src={`https://picsum.photos/299`} alt="My Profile Picture" /> {event.username}</div>
                   <div className={styles["event-date"]} aria-label="date">Date 📅: {event.date}</div>
                   <div className={styles["event-date"]} aria-label="time">Time 🕰️: {event.startTime} - {event.endTime}</div>
                  <div className={styles["event-description"]} aria-label="description">Description: {event.content}</div>
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
                        {userToAdd &&  <li className={list_styles["user-container"]} aria-label="user-to-add">
                            <User user={userToAdd}/>
                            <div className={list_styles["buttons-div"]}>
                            <button className={`${styles["custom-button"]} my-2 btn`} onClick={addUser}>+</button>
                            </div>
                            </li>}
                         </>}
                        {showAlert && (
                    <Alert
                        variant="danger"
                        onClose={() => setShowAlert(false)}
                        dismissible>
                        <label className={styles["alert-label"]} aria-label="error-label">{textAlert}</label>
                    </Alert>
                    )}
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

