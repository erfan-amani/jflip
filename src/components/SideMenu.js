import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SideMenu.css';
import logo from '../images/logo-yellow.svg';

const SideMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSideMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`side-menu ${isOpen ? '' : 'close'}`}>
      <img className="logo" src={logo} alt="Jflip" />
      <div className="side-nav">
        <Link to="/help">Help</Link>
        <Link to="/team">About Us</Link>
      </div>
      <p className="copyright">&copy; 2021 Jflip</p>
      <span className="toggle-btn" onClick={toggleSideMenu}></span>
      <div className="blur" onClick={toggleSideMenu}></div>
    </div>
  );
};

export default SideMenu;
