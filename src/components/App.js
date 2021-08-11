import React, { useRef, useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import Board from './Board';
import ToolBar from './ToolBar';
import { createJson } from '../createJson';
import SideMenu from './SideMenu';
import IntroPage from './IntroPage';
import HelpPage from './HelpPage';
import AboutUs from './AboutUs';

const App = () => {
  const [tool, setTool] = useState('select');
  // pass to the board
  const [shapes, setShapes] = useState([]);
  const [initialState, setInitialState] = useState(-1);
  const [transitions, setTransitions] = useState([]);
  const shapeCount = useRef(0);

  console.log(JSON.stringify(transitions));

  const resetBoard = () => {
    setShapes([]);
    setInitialState([]);
    setTransitions([]);
    shapeCount.current = 0;
  };

  return (
    <>
      <BrowserRouter>
        <div>
          <Route path="/" exact component={IntroPage} />
          <Route path="/help" component={HelpPage} />
          <Route path="/team" component={AboutUs} />
          <Route
            path="/board"
            render={() => {
              return (
                <>
                  <SideMenu />
                  <div className="workplace">
                    <ToolBar
                      setTool={setTool}
                      shapes={shapes}
                      transitions={transitions}
                      initialId={initialState}
                      createJson={createJson.bind(
                        null,
                        shapes,
                        transitions,
                        initialState
                      )}
                      isEmpty={shapes.length === 0 || transitions.length === 0}
                      hasInitial={initialState !== -1}
                      setShapes={setShapes}
                      setTransitions={setTransitions}
                      setInitialState={setInitialState}
                      resetBoard={resetBoard}
                    />
                    <Board
                      tool={tool}
                      shapes={shapes}
                      setShapes={setShapes}
                      initialState={initialState}
                      setInitialState={setInitialState}
                      transitions={transitions}
                      setTransitions={setTransitions}
                      shapeCount={shapeCount}
                    />
                  </div>
                </>
              );
            }}
          />
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
