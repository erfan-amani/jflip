export const createJson = (shapes, transitions, initialIndex) => {
  const json = {};
  const finals = [];
  const states = {};
  const transitionsList = [];

  shapes.forEach((shape) => {
    if (shape.isFinal) finals.push(shape.name);
    if (shape.id === initialIndex) json.start = shape.name;
    states[shape.id] = shape.name;
  });
  transitions.forEach((tr) => {
    const source = states[tr.idFrom];
    const target = states[tr.idTo];
    tr.values.forEach((val) =>
      transitionsList.push({ symbol: val === 'λ' ? 'E' : val, source, target })
    );
  });

  json.states = Object.values(states);
  json.accept = finals;
  json.transitions = transitionsList;
  return json;
};
