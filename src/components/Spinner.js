import React from 'react';

const Spinner = () => {
  return (
    <div
      className="ui segment"
      style={{ border: 0, height: '100vh', borderRadius: 0 }}
    >
      <div className="ui active dimmer">
        <div className="ui text large loader">Working on machine...</div>
      </div>
      <p></p>
    </div>
  );
};

export default Spinner;
