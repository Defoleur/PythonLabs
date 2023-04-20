import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import {
    BrowserRouter as Router,
    Routes,
    Route, BrowserRouter,
} from "react-router-dom";
import LoginPage from "./LoginPage";
import RegistrationPage from "./RegistrationPage";
import Navbar from "./Navbar";
import ProfilePage from "./ProfilePage";
import EventsPage from "./CreatedEventsPage";
import MainPage from "./MainPage";
import NavbarNotLogged from "./NavbarNotLogged";
import {Provider, useDispatch} from "react-redux";
import store from "./LoginStore";

function App() {
    // const [isLogged, setIsLogged] = useState(false)
    // useEffect(()=>{
    //     if (sessionStorage.getItem("username") === null){
    //         setIsLogged(false)
    //     }
    //     else{
    //         setIsLogged(true)
    //     }
    // }, [])
  return (
       <Provider store={store}>
    <BrowserRouter>
        <Navbar/>
      <Routes>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/registration" element={<RegistrationPage/>} />
          <Route path="/profile" element={<ProfilePage/>} />
          <Route path="/events" element={<EventsPage/>} />
      </Routes>
    </BrowserRouter>
       </Provider>
  );
}

export default App;
