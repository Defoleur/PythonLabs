import React, {useEffect} from "react";
import styles from "../Styles/UserList.module.scss";
import {IUser} from "../models";
import DeleteUser from "./DeleteUser";

interface UserListProps{
    users: IUser[],
    onDelete: (username: string) => void,
    onGiveRights: (username: string) => void;
}

export default function UserList({users, onDelete, onGiveRights} : UserListProps, userDeleted : boolean){
    const handleDelete = (username: string) => {
        onDelete(username);
    };
    const handleGiveRights = (username: string) => {
        onGiveRights(username);
    };
    return (
        <ul className={styles["user-list"]}>
        {users.map((user : IUser) => (
          <li className={styles["user-container"]}>
              <div className={styles["avatar-container"]}>
                <img src={`https://picsum.photos/${getRandomArbitrary(300, 500)}`} alt={user.username} />
              </div>
              <div className={styles["user-details-container"]}>
                <p>Username: {user.username}</p>
                <p>Email: {user.email}</p>
              </div>
              {user.role === "user" && (
                  <div className={styles["buttons-div"]}>
                  <button className={`${styles["action-button"]} btn`} onClick={() => handleGiveRights(user.username)}>🛠️</button>
                  <button className={`${styles["action-button"]} btn`} onClick={() => handleDelete(user.username)}>🗑️</button>
                  </div>
              )}
          </li>
        ))}
      </ul>
    )
}

function getRandomArbitrary(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}


