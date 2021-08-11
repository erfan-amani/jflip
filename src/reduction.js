const reduction = () => {
  // const json = `{"start":"q0","states":["q0","q1","q2","q3","q4","q5"],"accept":["q4","q0"],"transitions":[{"symbol":"0","source":"q3","target":"q2"},{"symbol":"1","source":"q2","target":"q1"},{"symbol":"1","source":"q1","target":"q0"},{"symbol":"1","source":"q5","target":"q4"},{"symbol":"1","source":"q4","target":"q3"},{"symbol":"1","source":"q3","target":"q1"},{"symbol":"0","source":"q2","target":"q2"},{"symbol":"1","source":"q5","target":"q2"},{"symbol":"0","source":"q0","target":"q2"},{"symbol":"1","source":"q3","target":"q5"}]}`;
  // const json = `{"start":"a","states":["a","b","c","d","e","f"],"accept":["a","e","h"],"transitions":[{"symbol":"0","source":"a","target":"b"},{"symbol":"1","source":"a","target":"d"},{"symbol":"0","source":"b","target":"e"},{"symbol":"1","source":"b","target":"d"},{"symbol":"0","source":"c","target":"f"},{"symbol":"1","source":"c","target":"b"},{"symbol":"0","source":"d","target":"e"},{"symbol":"1","source":"d","target":"b"},{"symbol":"0","source":"e","target":"f"},{"symbol":"1","source":"e","target":"g"},{"symbol":"0","source":"f","target":"h"},{"symbol":"1","source":"f","target":"g"},{"symbol":"0","source":"g","target":"h"},{"symbol":"1","source":"g","target":"f"},{"symbol":"0","source":"h","target":"d"},{"symbol":"1","source":"h","target":"c"}]}`;
  // const json =
  //   '{"start":"q0","states":["q0","q1","q2"],"accept":["q1"],"transitions":[{"symbol":"a","source":"q0","target":"q1"},{"symbol":"b","source":"q1","target":"q0"},{"symbol":"c","source":"q2","target":"q1"}]}';
  const json =
    '{"start":"q0","states":["q0","q1","q2","q3","q4"],"accept":["q4"],"transitions":[{"symbol":"a","source":"q0","target":"q1"},{"symbol":"b","source":"q0","target":"q2"},{"symbol":"a","source":"q1","target":"q1"},{"symbol":"b","source":"q1","target":"q3"},{"symbol":"b","source":"q2","target":"q2"},{"symbol":"a","source":"q2","target":"q1"},{"symbol":"a","source":"q3","target":"q1"},{"symbol":"b","source":"q3","target":"q4"},{"symbol":"a","source":"q4","target":"q1"},{"symbol":"b","source":"q4","target":"q2"}]}';

  const dfa = JSON.parse(json);
  const dfaTransitions = {};
  const symbols = [];
  const initial = dfa.start;
  let completeTable = []; // use in step 4

  // 1.create transitions list
  dfa.transitions.forEach((trs) => {
    dfaTransitions[trs.source] = {
      ...dfaTransitions[trs.source],
      [trs.symbol]: trs.target,
      isFinal: dfa.accept.includes(trs.source),
      isInitial: dfa.start === trs.source,
    };
    if (!symbols.includes(trs.symbol)) symbols.push(trs.symbol);
  });
  // for test
  // const symbols = ['a', 'b'];
  // const initial = 'a'
  // const dfaTransitions = {
  //   q0: { a: 'q1', b: 'q5', isInitial: true, isFinal: false },
  //   q1: { a: 'q6', b: 'q2', isInitial: false, isFinal: false },
  //   q2: { a: 'q0', b: 'q2', isInitial: false, isFinal: true },
  //   q4: { a: 'q7', b: 'q5', isInitial: false, isFinal: false },
  //   q5: { a: 'q2', b: 'q6', isInitial: false, isFinal: false },
  //   q6: { a: 'q6', b: 'q4', isInitial: false, isFinal: false },
  //   q7: { a: 'q6', b: 'q2', isInitial: false, isFinal: false },
  // };
  // dfaTransitions = { ...JSON.parse(json1) };
  // 2.find reachable states
  const reachables = [initial];
  let count = 0;
  while (reachables.length !== count) {
    // prettier-ignore
    symbols.forEach((sym) => {// eslint-disable-line no-loop-func
      const val = dfaTransitions[reachables[count]][sym];
      if (val === undefined) dfaTransitions[reachables[count]][sym] = null;
      if (val !== undefined && !reachables.includes(val)) reachables.push(val)
    });
    count++;
  }
  reachables.sort();
  // 3.create transition table
  let transitionTable = {};
  reachables.forEach((state) => {
    transitionTable = { ...transitionTable, [state]: dfaTransitions[state] };
  });
  // 4.complete the table
  let lastHs = [];
  let prevLastHs = [];
  for (const state in transitionTable) {
    const val = [];
    val.push(state);
    symbols.forEach((sym) => val.push(transitionTable[state][sym])); // eslint-disable-line no-loop-func
    val.push(transitionTable[state].isFinal ? 1 : 0);
    lastHs.push(val[val.length - 1]);
    completeTable.push(val);
  }
  do {
    let types = [];
    prevLastHs = [...lastHs];
    lastHs = [];
    // prettier-ignore
    completeTable.forEach((row, i) => {// eslint-disable-line no-loop-func
      // const state = row[0];
      const val = [];
      let newType = String(prevLastHs[i]);
      symbols.forEach((sym, i) => {
        const go = reachables.indexOf(row[i + 1]);
        val.push(prevLastHs[go]);
        newType = newType + String(val[val.length-1])
      });
      if (!types.includes(newType)) types.push(newType)
      val.push(types.indexOf(newType));
      lastHs.push(val[val.length-1]);
      completeTable[i] = [...row, ...val]
    });
  } while (lastHs.join('') !== prevLastHs.join(''));
  const strigifiedRows = completeTable.map((row) => row.slice(3, -1).join(''));

  let reapetedStates = [];
  const temp = [];
  strigifiedRows.forEach((row, i) => {
    const index = temp.indexOf(row);
    if (index !== -1)
      reapetedStates.push(strigifiedRows.indexOf(temp[index]), i);
    else temp.push(row);
  });
  //5.1 delete reapeted rows
  reapetedStates.forEach((state, i) => {
    if (i % 2 === 1) delete transitionTable[reachables[state]];
  });
  //5.2 replace deleted states
  reapetedStates = reapetedStates.map((state) => reachables[state]);
  for (const state in transitionTable) {
    // prettier-ignore
    symbols.forEach((sym) => {// eslint-disable-line no-loop-func
      reapetedStates.forEach((rep, i) => {
        if (i % 2 === 1) {
          if (transitionTable[state][sym] === rep) {
            transitionTable[state][sym] = reapetedStates[i - 1];
          }
        }
      });
    });
  }

  //6. make the table standard
  const newTransitionTable = {};
  const oldStatesName = [initial];
  let counter = 0;
  const states = [];
  for (const state in transitionTable) {
    states.push(state);
  }
  while (counter < states.length) {
    const val = {};
    const state = oldStatesName[counter];
    if (!oldStatesName.includes(state)) {
      oldStatesName.push(state);
    }
    // prettier-ignore
    symbols.forEach((sym) => { // eslint-disable-line no-loop-func
      const go = transitionTable[state][sym];
      
      if (go != null && !oldStatesName.includes(go)) {
        oldStatesName.push(go)
      }
      if (go !== null)
      val[sym] = oldStatesName.indexOf(go);
    });
    newTransitionTable[oldStatesName.indexOf(state)] = {
      ...val,
      isFinal: transitionTable[state].isFinal,
      isInitial: transitionTable[state].isInitial,
    };
    counter++;
  }
  // create expected format of output
  const output = { transitions: [], symbols: [], accept: [], states: [] };
  for (const stateName in newTransitionTable) {
    const state = newTransitionTable[stateName];
    if (state.isInitial) output.start = stateName;
    if (state.isFinal) output.accept.push(stateName);
    if (!output.states.includes(stateName)) output.states.push(stateName);
    symbols.forEach((sym) => {
      if (state.hasOwnProperty(sym)) {
        output.transitions.push({
          symbol: sym,
          source: stateName,
          target: state[sym],
        });
        if (!output.symbols.includes(sym)) output.symbols.push(sym);
      }
    });
  }
  console.log(output);
  return output;
};

export default reduction;
