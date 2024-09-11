import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; 
import { useSuperContext } from '../../../context/SuperContext';

const Header = () => {
    const { loggedIn, setLoggedIn } = useSuperContext();
    console.log(loggedIn);

    const handleLogout = () => {
        setLoggedIn(false);
    };

    return (
        <header className="header">
            <div className="logo">
                <Link to="/">ClkPortal</Link>
            </div>
            <div className="nav">
                {loggedIn ? (
                    <button onClick={handleLogout} className="nav-link">Logout</button>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="nav-link">Register</Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
