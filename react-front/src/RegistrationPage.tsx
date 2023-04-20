import React, { useState } from 'react';
import './Styles/AuthenticationPages.module.css';
import './Styles/RegistrationPage.module.css';
import {Link, useNavigate} from "react-router-dom";
import styles from "./Styles/AuthenticationPages.module.css"
import registration_styles from "./Styles/RegistrationPage.module.css"
import Registration from "./RegistrationService";

export default function RegistrationPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const requestUrl = 'http://127.0.0.1:5000/api/v1/user';
  const navigation = useNavigate();

// eslint-disable-next-line no-unused-vars
function submitClick() {
    if (password !== confirmPassword){
        alert("Passwords are not the same!");
        return
    }
    const body = {
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
    };
    Registration(requestUrl, body).then(() =>
        navigation('/login')
    );
}


  return (
      <div className={registration_styles['body-registration']}>
    <main>
      <div className={registration_styles['container-custom-registration']}>
        <div className="row">
            <h1 className={styles['h1-custom']}>Welcome to EventCD!</h1>
            <form onSubmit={submitClick}>
              <div className={styles['form-group']}>
                <label className={styles['label']} htmlFor="username">Username:</label>
                <input
                  type="text"
                  required
                  pattern="\w{3,16}"
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
                  required
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  className="form-control"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className={styles['form-group']}>
                <label className={styles['label']} htmlFor="confirm-password">Confirm password:</label>
                <input
                  type="password"
                  required
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  className="form-control"
                  id="confirm-password"
                  name="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className={styles['form-group']}>
                <label className={styles['label']} htmlFor="first-name">First name:</label>
                <input
                  type="text"
                  className="form-control"
                  id="first-name"
                  name="first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className={styles['form-group']}>
                <label className={styles['label']} htmlFor="last-name">Last name (optional):</label>
                <input
                  type="text"
                  className="form-control"
                  id="last-name"
                  name="last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className={styles['form-group']}>
                <label className={styles['label']} htmlFor="email">Email:</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
                <div className={styles['form-group']}>
                    <label className={styles['label']} htmlFor="phone">Phone:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="phone"
                        name="phone"
                    value={phone}
                  onChange={(e) => setPhone(e.target.value)}/>
                </div>
                <button type="button" className="btn btn-primary btn-block" onClick={submitClick}>Register</button>
                <label className={styles['label']} htmlFor="password">Have account yet? For login click <Link to="/login">here</Link>.</label>
				</form>
          </div>
      </div>
    </main>
          </div>
  )
}
