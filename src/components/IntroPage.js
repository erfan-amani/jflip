import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import './IntroPage.css';
import helpImage from '../images/help-image.svg';
import logo from '../images/logo-yellow.svg';

const IntroPage = () => {
  const help = useRef();
  const intro = useRef();

  const goNextPage = () => {
    help.current.style.left = 0;
  };

  return (
    <div>
      <div ref={intro} className="page welcome-container">
        <img className="big-logo" src={logo} alt="logo" />
        <p style={{ textAlign: 'center', fontSize: '16px' }}>
          Welcome to <span className="jflip">Jflip</span>
          <br />
          We are here to make your work so easy
          <br />
          Hope you enjoy
        </p>
        <button className="ui black button help-cta" onClick={goNextPage}>
          Next
        </button>
      </div>
      <div ref={help} className="page help-container">
        <h1 className="help-header">How app works</h1>
        <p>
          In app you'll see a menu just like this one. This menu has all tools
          you may need.
        </p>

        <img className="help-img" src={helpImage} alt="help text" />
        <Link to="/board">
          <button className="ui black button help-cta">Let's start</button>
        </Link>
      </div>
    </div>
  );
};

export default IntroPage;
