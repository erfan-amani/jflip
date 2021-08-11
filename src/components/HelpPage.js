import React from 'react';
import { Link } from 'react-router-dom';
import helpImage from '../images/help-image.svg';

const HelpPage = () => {
  return (
    <div className="page help-container active">
      <h1 className="help-header">How app works</h1>
      <p>
        In app you'll see a menu just like this one. This menu has all tools you
        may need.
      </p>

      <img className="help-img" src={helpImage} alt="help text" />
      <Link to="/board">
        <button className="ui black button help-cta">Back to the board</button>
      </Link>
    </div>
  );
};

export default HelpPage;
