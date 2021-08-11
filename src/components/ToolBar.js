import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'react-responsive-modal';
import axios from 'axios';
import 'react-responsive-modal/styles.css';
import initialRender from '../initialRender';
import logo from '../images/logo-yellow.svg';

const ToolBar = ({
  setTool,
  createJson,
  isEmpty,
  hasInitial,
  setShapes,
  setTransitions,
  setInitialState,
  resetBoard,
}) => {
  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const changeActive = (e) => {
    const target = e.target.closest('span');
    if (!target) return;
    if (target.classList.contains('reset')) return;

    document.querySelector('.item.active')?.classList.remove('active');
    target.classList.add('active');
    setTool(target.classList[0]);
  };

  const onClick = (e) => {
    if (isEmpty || !hasInitial) {
      onOpenModal();
      return;
    }
    e.preventDefault();
    const inputJson = createJson();
    axios
      .get(
        `https://www.terminol.goodfollower.com/jflip-nfatodfa.php?value=${JSON.stringify(
          inputJson
        )}`
      )
      .then((res) => {
        if (res.data !== null)
          initialRender(setShapes, setTransitions, setInitialState, res.data);
        else console.log('✅The machine is already a dfa.');
      })
      .catch((err) => console.log('❌' + err));
    if (e.target.innerText === 'Reduction') {
      axios
        .get(
          `https://www.terminol.goodfollower.com/jflip-reduction.php?value=${JSON.stringify(
            inputJson
          )}`
        )
        .then((res) => {
          if (res.data != null)
            initialRender(setShapes, setTransitions, setInitialState, res.data);
          else console.log("✅Can't minimize the machine more.");
        })
        .catch((err) => console.log('❌' + err));
    }
  };
  return (
    <div
      className="ui inverted menu"
      onClick={changeActive}
      style={{
        borderRadius: '0',
        padding: '15px 25px',
        marginBottom: '0px',
        fontSize: '16px',
      }}
    >
      <Link to="/board" style={{ marginRight: 'auto' }}>
        <img src={logo} alt="Jflip" />
      </Link>
      <span className="select item active" style={{ cursor: 'pointer' }}>
        <i className="mouse pointer inverted yellow icon"></i>
        Select
      </span>
      <span className="addState item" style={{ cursor: 'pointer' }}>
        <i className="plus circle inverted yellow icon"></i>
        State
      </span>
      <span className="addLine item" style={{ cursor: 'pointer' }}>
        <i className="long arrow alternate right inverted yellow icon"></i>
        Transition
      </span>
      <span className="delete item" style={{ cursor: 'pointer' }}>
        <i className="trash inverted yellow icon"></i>
        Delete
      </span>
      <span
        className="reset item"
        style={{ cursor: 'pointer' }}
        onClick={resetBoard}
      >
        <i className="sync inverted yellow icon"></i>
        Reset
      </span>
      <div className="right menu">
        <button className="ui inverted button" onClick={onClick}>
          NFA to DFA
        </button>
        <button className="ui inverted yellow button" onClick={onClick}>
          Reduction
        </button>
      </div>
      <Modal open={open} onClose={onCloseModal} center>
        <div className="ui container">
          <div>
            <i className="exclamation circle big yellow icon" />
            <span className="ui normal header" style={{ paddingTop: 10 }}>
              Somthing is wrong.
            </span>
          </div>
          <p style={{ paddingTop: 10, paddingLeft: 35 }}>
            If you see this error this can has two main reason:{<br />} First
            there isn't any state or transition{<br />} Second maybe you don't
            set a initial state
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default ToolBar;
