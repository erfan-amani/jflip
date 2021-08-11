import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import _ from 'lodash';
import { Checkbox } from 'semantic-ui-react';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import CircleState from './CircleState';
import Transiton from './Transition';

const Board = ({
  tool,
  shapes,
  setShapes,
  initialState,
  setInitialState,
  transitions,
  setTransitions,
  shapeCount,
}) => {
  const [selectedShape, setSelectedShape] = useState(null);
  const [open, setOpen] = useState(false);
  const arrowCount = useRef(0);

  const formValue = useRef({
    value: '',
    submited: false,
    target: null,
    type: '',
  });
  const finalInput = useRef();
  const initialInput = useRef();

  useEffect(() => {
    setSelectedShape(null);
  }, [tool]);

  const createShape = ({ evt }) => {
    if (tool !== 'addState') return;
    const id = shapeCount.current++;
    onOpenModal();
    setShapes([
      ...shapes,
      {
        name: 'q' + id,
        x: evt.offsetX,
        y: evt.offsetY,
        id: id,
        isFinal: false,
      },
    ]);
  };
  useEffect(() => {
    if (shapes.length !== 0 && formValue.current.submited === true)
      setOrChangeType(shapes.length);
  }, [shapes]); // eslint-disable-line react-hooks/exhaustive-deps

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  useEffect(() => {
    if (formValue.current.submited) {
      setOrChangeType(shapes.length - 1);
    }
  }, [formValue.current.submited]); // eslint-disable-line react-hooks/exhaustive-deps

  const changeType = (targetIndex) => {
    const newValue = formValue.current.value;
    const targetState = shapes[targetIndex];

    if (targetState.id === initialState && !newValue.isInitial)
      setInitialState(-1);

    if (newValue.isInitial) setInitialState(targetState.id);
    console.log(newValue);
    targetState.isFinal = newValue?.isFinal;

    formValue.current.value = {};

    setShapes([
      ...shapes.filter((shape) => shape.id !== targetState.id),
      targetState,
    ]);
  };

  const setOrChangeType = (newStateIndex = null) => {
    if (formValue.current.target !== null) {
      const targetState = _.findIndex(shapes, {
        id: formValue.current.target.parent.getId(),
      });
      changeType(targetState);
    } else {
      changeType(newStateIndex);
    }
    formValue.current = {
      value: formValue.current.value,
      submited: false,
      target: null,
    };
  };

  const doubleClickOnState = ({ target }) => {
    if (tool !== 'select') return;

    formValue.current.target = target;
    const targetState = _.findIndex(shapes, {
      id: formValue.current.target.parent.getId(),
    });
    formValue.current.value = {
      isFinal: shapes[targetState].isFinal,
      isInitial: shapes[targetState].id === initialState,
    };
    formValue.current.thisState = shapes[targetState];
    onOpenModal();
  };

  const onShapeClick = ({ target }) => {
    // delete
    if (tool === 'delete') {
      deleteTransition(null, target.parent.getId());
      setShapes(shapes.filter((shape) => target.parent.getId() !== shape.id));
    }
    // create connector
    if (tool === 'addLine') {
      if (selectedShape) {
        const newTransition = {
          idFrom: selectedShape.getId(),
          idTo: target.parent.getId(),
        };
        const duplicateConnector = _.find(transitions, newTransition);
        const id = 'arrow-' + ++arrowCount.current;
        const value = window.prompt('Enter the value of transitions', 'λ');
        newTransition.id = id;

        setSelectedShape(null);

        if (duplicateConnector) {
          // value is same too
          if (duplicateConnector.values.includes(value)) return;
          // diffrent value
          newTransition.values = [
            ...duplicateConnector.values,
            value === '' ? 'λ' : value,
          ];
          setTransitions([
            ...transitions.filter((con) => !_.isEqual(con, duplicateConnector)),
            newTransition,
          ]);
        } else {
          newTransition.values = [value === '' ? 'λ' : value];
          setTransitions([...transitions, newTransition]);
        }
      } else {
        setSelectedShape(target.parent);
      }
    }
  };

  const updatePosition = ({ target }) => {
    const updatedShape = {
      ..._.find(shapes, { id: target.getId() }),
      ...target.position(),
    };
    setShapes([
      updatedShape,
      ...shapes.filter((shape) => shape.id !== target.getId()),
    ]);
  };

  const doubleClickOnTransition = ({ target }) => {
    const inputValue = window.prompt('Enter the new value', 'λ');
    if (inputValue === null || target.attrs.text === inputValue) return;

    const targetTransition = _.find(transitions, { id: target.attrs.id });
    const arrayOfValues = targetTransition.values.filter(
      (value) => value !== target.attrs.text
    );

    if (!arrayOfValues.includes(inputValue)) arrayOfValues.push(inputValue);

    const newTransitions = transitions.filter(
      (tr) => target.attrs.id !== tr.id
    );
    targetTransition.values = arrayOfValues;
    setTransitions([...newTransitions, targetTransition]);
  };

  const renderedShapes = () =>
    shapes.map((shape) => (
      <CircleState
        key={'q' + shape.id}
        tool={tool}
        shape={shape}
        setShapes={setShapes}
        shapes={shapes}
        onShapeClick={onShapeClick}
        onShapeDarg={updatePosition}
        isSelected={selectedShape?.getId() === shape.id}
        isInitial={initialState === shape.id}
        doubleClickOnState={doubleClickOnState}
      />
    ));

  const deleteTransition = (event, shapeId = null) => {
    if (tool !== 'delete') return;

    // delete connetor with shape
    if (shapeId) {
      setTransitions([
        ...transitions.filter(
          (transition) =>
            transition.idFrom !== shapeId && transition.idTo !== shapeId
        ),
      ]);
      return;
    }
    const id = event.target.parent.getId();
    const text = event.target.attrs.text;

    if (tool === 'delete') {
      const mustDelete = _.find(transitions, { id: id });

      if (
        mustDelete.values.length === 1 ||
        event.target.attrs.name === 'arrow'
      ) {
        setTransitions([...transitions.filter((con) => con.id !== id)]);
        return;
      } else {
        const others = transitions.filter((con) => con.id !== id);
        mustDelete.values = mustDelete.values.filter((value) => value !== text);
        setTransitions([...others, mustDelete]);
      }
    }
  };

  const renderedConnetors = () => {
    return transitions.map((data, index) => {
      // prettier-ignore
      const from = _.find(shapes, { 'id': data.idFrom })
      // prettier-ignore
      const to = _.find(shapes, { 'id': data.idTo });
      return (
        <Transiton
          key={`arr${index}-${from?.id}to${to?.id}`}
          from={from}
          to={to}
          deleteTransition={deleteTransition}
          data={data}
          transitionIndex={index}
          transitions={transitions}
          doubleClickOnTransition={doubleClickOnTransition}
        />
      );
    });
  };

  // const checkBoxChange = () => {}

  const onFormChange = (target) => {
    if (target === 'Final') {
      formValue.current.value = {
        ...formValue.current.value,
        isFinal: !finalInput.current.inputRef.current.checked,
      };
    }
    if (target === 'Initial') {
      formValue.current.value = {
        ...formValue.current.value,
        isInitial: !initialInput.current.inputRef.current.checked,
      };
    }
    // formValue.current = {
    //   ...formValue.current,
    //   value: {
    //     isInitial: initialInput.current.checked,
    //     isFinal: finalInput.current.checked,
    //   },
    // };
    // formValue.current = { ...formValue.current, value: value };
  };

  const onFromSubmit = (e) => {
    e.preventDefault();
    formValue.current = { ...formValue.current, submited: true };
    // formValue.current = { ...formValue.current, submited: true };
    onCloseModal();
  };

  return (
    <div style={{ backgroundColor: '#fff5b7' }}>
      <Stage
        onClick={(e) => createShape(e)}
        width={window.innerWidth}
        height={window.innerHeight - 78}
      >
        <Layer>
          {renderedShapes()}
          {renderedConnetors()}
        </Layer>
      </Stage>
      <Modal open={open} onClose={onCloseModal} center>
        <form
          style={{ padding: 10, paddingTop: 30, paddingRight: 50 }}
          onSubmit={(e) => onFromSubmit(e)}
          // onChange={(e) => onFormChange(e.target.value)}
        >
          <div className="ui form">
            <div className="grouped fields">
              <label>
                <h3 className="ui header" style={{ paddingBottom: 10 }}>
                  Select the type of state:
                </h3>
              </label>
              {/* <div className="field">
                <div className="ui  checkbox large input">
                  <input
                    type="checkbox"
                    id="normal"
                    name="gender"
                    value="normal"
                  />
                  <label htmlFor="normal" style={{ cursor: 'pointer' }}>
                    Normal
                  </label>
                </div>
              </div> */}
              <div className="field">
                <Checkbox
                  ref={finalInput}
                  onChange={(e) => onFormChange(e.target.textContent)}
                  label="Final"
                  defaultChecked={formValue.current.thisState?.isFinal}
                />
                {/* <div
                  className={`ui ${
                    formValue.current.thisState?.isFinal ? 'checked' : 'x'
                  } checkbox large input`}
                >
                <input
                    ref={finalInput}
                    checked=""
                    type="checkbox"
                    id="final"
                    name="gender"
                    value="final"
                  />
                  <label htmlFor="final" style={{ cursor: 'pointer' }}>
                    Final
                  </label>
                </div> */}
              </div>
              <div className="field">
                <Checkbox
                  ref={initialInput}
                  onChange={(e) => onFormChange(e.target.textContent)}
                  label="Initial"
                  defaultChecked={
                    formValue.current.thisState?.id === initialState
                  }
                />
                {/* <div
                  className={`ui ${
                    formValue.current.thisState?.isFinal ? 'checked' : 'x'
                  } checkbox large input`}
                >
                  <input
                    ref={initialInput}
                    // checked=""
                    type="checkbox"
                    id="initial"
                    name="gender"
                    value="initial"
                  />
                  <label htmlFor="initial" style={{ cursor: 'pointer' }}>
                    Initial
                  </label>
                </div> */}
              </div>
            </div>
          </div>
          <input
            style={{ marginTop: 15 }}
            className="ui secondary button"
            type="submit"
            value="Save change"
          />
        </form>
      </Modal>
    </div>
  );
};

export default Board;
