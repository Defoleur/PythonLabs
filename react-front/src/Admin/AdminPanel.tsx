import React, { useState, useEffect } from "react";
import {IUser} from "../models";
import {getUsers} from "./UsersService";
import styles from "../Styles/UserList.module.scss"
import UserList from "./UserList";
import DeleteUser from "./DeleteUser";
import GiveRightsToUser from "./UpdateUser";
import Loading from "../Loading";

export default function AdminPanel() {
    const requestUrl = `http://127.0.0.1:5000/api/v1/users`;
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    getData()
  }, []);
const handleUserDelete = (username: string) => {
    const url = `http://127.0.0.1:5000/api/v1/user/${username}`;
    DeleteUser(url).then(async () => {
        setIsLoading(true)
        await getData()
        setIsLoading(false)
    });


  };
const handleGiveUserRights = (username: string) => {
    const url = `http://127.0.0.1:5000/api/v1/user/admin/${username}`;
    GiveRightsToUser(url).then(async () => {
        setIsLoading(true)
        await getData()
        setIsLoading(false)
    });

  };
const getData = async () => {
    await getUsers(requestUrl).then((data) => {
        setIsLoading(true)
        setAdmins(data.filter((user: IUser) => user.role === "admin"));
        setUsers(data.filter((user: IUser) => user.role === "user"));
        setIsLoading(false)
    });
}
  return (
      <div className={styles.body}>
    <div className={styles["user-list-container"]}>
        <div className={styles["column"]}>
            {isLoading ? <Loading color="black"/> :
                <><h1 className={styles["column-h1"]}>Admins</h1>
            <UserList users={admins} onDelete={handleUserDelete} onGiveRights={handleGiveUserRights}/></>}
        </div>
        <div className={styles["column"]}>
            {isLoading ? <Loading color="black"/> :<>
      <h1 className={styles["column-h1"]}>Users</h1>
            <UserList users={users} onDelete={handleUserDelete} onGiveRights={handleGiveUserRights}/></>}
        </div>
    </div>
     </div>
  );
};

function getRandomArbitrary(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}
