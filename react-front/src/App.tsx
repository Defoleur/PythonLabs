import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import {
    BrowserRouter as Router,
    Routes,
    Route, BrowserRouter,
} from "react-router-dom";
import LoginPage from "./Login/LoginPage";
import RegistrationPage from "./Registration/RegistrationPage";
import Navbar from "./Navbar";
import ProfilePage from "./Profile/ProfilePage";
import EventsPage from "./Events/CreatedEventsPage";
import MainPage from "./MainPage";
import NavbarNotLogged from "./NavbarNotLogged";
import {Provider, useDispatch} from "react-redux";
import store from "./Login/LoginStore";
import AdminPanel from "./Admin/AdminPanel";
import AuthorizedRoute from "./Routes/AuthorizedRoute";
import ErrorPage from "./Errors/ErrorPage";
import AdminRoute from "./Routes/AdminRoute";

function App() {
    // const [isLogged, setIsLogged] = useState(false)
    const dispatch = useDispatch();
    useEffect(()=>{
        if (sessionStorage.getItem("username") === null){
            dispatch({ type: 'LOGOUT' });
        }
        else{
            dispatch({ type: 'LOGIN' });
        }
    }, [])
  return (
       <Provider store={store}>
    <BrowserRouter>
        <Navbar/>
      <Routes>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/registration" element={<RegistrationPage/>} />
          <Route path="/profile" element={
              <AuthorizedRoute><ProfilePage/></AuthorizedRoute>} />
          <Route path="/events" element={<AuthorizedRoute><EventsPage/></AuthorizedRoute>} />
          <Route path="/admin" element={<AuthorizedRoute>
              <AdminRoute>
              <AdminPanel/>
                  </AdminRoute>
          </AuthorizedRoute>} />
          <Route path="*" element={<ErrorPage code={404} error="Not Found" text="The page you're looking for doesn't exist 😵"/>} />
      </Routes>
    </BrowserRouter>
       </Provider>
  );
}

export default App;
