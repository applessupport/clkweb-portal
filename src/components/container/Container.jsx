import React from 'react';
import { HashRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import Register from '../view/Register/Register';
import { useSuperContext } from '../../context/SuperContext';
import Dashboard from '../view/Dashboard/Dashboard';
import Header from '../view/Header/Header';
import Login from '../view/Register/Login';


const Container = () => {

    const {loggedIn} = useSuperContext();

    return (
       <Router>
        <Header />
        <Routes>
        <Route path="/" element={loggedIn ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/dashboard" element={loggedIn ? <Dashboard /> : <Navigate to="/" />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        </Routes>
       </Router>
  )
}

export default Container;