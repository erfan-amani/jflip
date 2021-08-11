import _ from 'lodash';
const initialRender = (setShapes, setTransitions, setInitialState, dfa) => {
  // render states
  const boardWidth = document.querySelector('canvas').clientWidth;
  const boardHeight = document.querySelector('canvas').clientHeight;
  const getPosition = () => {
    const pos = {
      x: Math.floor(Math.random() * boardWidth),
      y: Math.floor(Math.random() * boardHeight),
    };
    return pos;
  };
  let initialIndex;
  const stateDictionary = {};
  const states = dfa.states.map((state, index) => {
    if (state === dfa.start) initialIndex = index + 1;
    stateDictionary[state] = index + 1;
    return {
      name: state.toString(),
      // name: '555',
      id: index + 1,
      isFinal: dfa.accept.includes(state),
      ...getPosition(),
    };
  });

  // render transitions

  const transitions = [];
  dfa.transitions.forEach((trs, index) => {
    const duplicate = _.find(transitions, {
      idFrom: stateDictionary[trs.source],
      idTo: stateDictionary[trs.target],
    });
    if (duplicate) {
      // console.log(duplicate);
      duplicate.values.push(trs.symbol);
    } else {
      transitions.push({
        idFrom: stateDictionary[trs.source],
        idTo: stateDictionary[trs.target],
        id: `arrow-${index + 1}`,
        values: [trs.symbol],
      });
    }
  });
  setShapes([...states]);
  setTransitions(transitions);
  setInitialState(initialIndex);
};

export default initialRender;
