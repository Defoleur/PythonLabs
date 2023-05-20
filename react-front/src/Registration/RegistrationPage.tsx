import React, { useState } from 'react';
import '../Styles/AuthenticationPages.module.css';
import '../Styles/RegistrationPage.module.css';
import {Link, useNavigate} from "react-router-dom";
import styles from "../Styles/AuthenticationPages.module.css"
import registration_styles from "../Styles/RegistrationPage.module.css"
import Registration from "./RegistrationService";
import {Alert} from "react-bootstrap";
import ErrorMessageProvider from "../ErrorMessageProvider";


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
  const [showAlert, setShowAlert] = useState(false);
  const [textAlert, setTextAlert] = useState("");


async function submitClick() {
    if (password !== confirmPassword){
         setTextAlert(ErrorMessageProvider("Passwords are not the same!"))
      setShowAlert(true);
        // alert("Passwords are not the same!");
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
    await Registration(requestUrl, body).then(() => {
        navigation('/login')
        alert("User was successfully created. Please login now!")
    }).catch ((error) => {
      setTextAlert(ErrorMessageProvider(error.message))
      setShowAlert(true);
    })
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
                  aria-label="username"
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
                  aria-label="password"
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
                  aria-label="confirm-password"
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
                  aria-label="first-name"
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
                  aria-label="last-name"
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
                  aria-label="email"
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
                        aria-label="phone"
                    value={phone}
                  onChange={(e) => setPhone(e.target.value)}/>
                </div>
                <button type="button" className={`${styles['auth-button']} btn btn-primary btn-block`}onClick={submitClick}>Register</button>
                <label className={styles['label']} htmlFor="password">Have account yet? For login click <Link to="/login">here</Link>.</label>
				</form>
            {showAlert && (
              <Alert
                variant="danger"
                onClose={() => setShowAlert(false)}
                dismissible
              >
                <label className={styles['alert-label']} aria-label="error-label">{textAlert}</label>
              </Alert>
            )}
          </div>
      </div>
    </main>
          </div>
  )
}
