import React, {memo, useEffect} from "react";
import styles from "../Styles/UserList.module.scss";
import {IUser} from "../models";

interface UserListProps{
    user: IUser,
}

export const User = memo(({user} : UserListProps) => {
    return (<>
              <div className={styles["avatar-container"]}>
                <img src={`https://picsum.photos/${getRandomArbitrary(300, 500)}`} alt={user.username} />
              </div>
              <div className={styles["user-details-container"]}>
                <p>Username: {user.username}</p>
                <p>Email: {user.email}</p>
              </div>
        </>
        )
})

function getRandomArbitrary(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}


