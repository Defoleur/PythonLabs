import React, {useState} from "react";
import styles from "./Styles/AuthenticationPages.module.css"
import login_styles from "./Styles/LoginPage.module.css"
import {Link, Route, useNavigate} from 'react-router-dom'
//import login from "./AJAX/login.js";
import RegistrationPage from "./RegistrationPage";
import {Login} from "./Login";
export default function LoginPage() {
    const requestUrl = 'http://127.0.0.1:5000/api/v1/user/login';
    const navigation = useNavigate();
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('')
  const onClick = () => {
    const body = {
        username: username,
        password: password,
    };
    console.log(body);
    Login(requestUrl, body).then((data) => {
        sessionStorage.setItem('token', data.basic);
        sessionStorage.setItem('username', body.username);
        navigation('/profile')
        //window.location.href = '/profile';
    });
  };

  return (
      <div className={login_styles["body"]}>
    <div className={login_styles["container-custom"]}>
      <div className="row">
        <div className="col">
          <h1 className={styles['h1-custom']}>Welcome back to EventCD!</h1>
          <form>
            <div className={styles['form-group']}>
              <label className={styles['label']} htmlFor="username">Username:</label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className={styles['form-group']}>
              <label className={styles['label']} htmlFor="password">Password:</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={onClick}
            >
              Login
            </button>
            <label className={styles['label']} htmlFor="password">
              Haven't account yet? For registration click{" "}
              <Link to="/registration">here</Link>.
            </label>
          </form>
        </div>
      </div>
    </div>
      </div>
  );
}


