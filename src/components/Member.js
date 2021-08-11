import React from 'react';

const Member = ({ image, name, description = null }) => {
  return (
    <div className="column">
      <div className="ui fluid card">
        <div className="image">
          <img src={image} alt="member img" />
        </div>
        <div className="content">
          <span className="header">{name}</span>
        </div>
      </div>
    </div>
  );
};

export default Member;
