import React, { useEffect, useState } from "react";
import "./App.css";

/**
 * Code credit: https://stackoverflow.com/questions/66099800/how-to-hide-shadow-of-draggable-div-while-dragging
 */
document.addEventListener(
  "dragstart",
  function (event) {
    event.dataTransfer.setDragImage(
      new Image(0, 0),
      window.outerWidth,
      window.outerHeight
    );
  },
  false
);

function ColourSelectPanel({ id, onClickFn }) {
  return (
    <div className="color-select-panel">
      <div
        onClick={onClickFn.bind(null, "rgba(0, 0, 255, 0.4)")}
        className="color-selection-square-blue"
      ></div>
      <div
        onClick={onClickFn.bind(null, "rgba(255, 0, 0, 0.4)")}
        className="color-selection-square-red"
      ></div>
      <div
        onClick={onClickFn.bind(null, "rgba(0, 255, 0, 0.4)")}
        className="color-selection-square-green"
      ></div>
    </div>
  );
}

function App() {
  const colours = ["red", "green", "blue"];

  return (
    <div className="App">
      <ListContainer></ListContainer>
    </div>
  );
}

function ListItem(props) {
  function handleClick() {
    props.updateFn(props.index);
  }
  return (
    <button onClick={handleClick}>
      Show current list state from ListItem for {props.index}
    </button>
  );
}

function ListContainer() {
  const [list, setList] = useState<number[]>([]);

  const handleClick = () => {
    setList([...list, 5]);
  };

  const log = (index) => {
    console.log(list);
    console.log("index is: ", index);
  };

  const listItems = list.map((v, index) => (
    <ListItem updateFn={log} index={index}></ListItem>
  ));

  return (
    <div className="list-container">
      {/* <button onClick={handleClick}>Add item from ListContainer</button> */}
      <h1>Timeblocking</h1>
      <p>
        See{" "}
        <a href="https://www.calnewport.com/blog/2013/12/21/deep-habits-the-importance-of-planning-every-minute-of-your-work-day/">
          here
        </a>{" "}
        for an explanation of Timeblocking.
      </p>
      {listItems}
      <HoursBoard />
    </div>
  );
}

function HoursBoard() {
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [initialClientDown, setInitialClientDown] = useState(0);
  const [initialClientUp, setInitialClientUp] = useState(0);
  const [currentClientMousePosition, setCurrentClientMousePosition] =
    useState(0);
  const [objects, setObjects] = useState<any[]>([]);

  useEffect(() => {
    console.log("todo make this useful");
  }, [isCreating]);

  function handleMouseDown(e) {
    setIsCreating(true);
    setInitialClientDown(e.clientY);
    setInitialClientUp(e.clientY);
  }
  function handleMouseUp(e) {
    setIsCreating(false);
    setInitialClientUp(e.clientY);
    setObjects([
      ...objects,
      {
        top: `${initialClientDown}px`,
        height: `${currentClientMousePosition - initialClientDown}px`,
      },
    ]);
    // actually create an object
    setInitialClientDown(0);
  }

  function handleMouseMove(e) {
    if (isCreating) {
      setCurrentClientMousePosition(e.clientY);
    }
  }

  /**
   * Working hours of the day.
   */
  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  const verticalView = hours.map((hour) => {
    return (
      <div
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="planner-day-row-container"
      >
        <div className="left-number">{hour}</div>
        <div className="planner-day-row"></div>
      </div>
    );
  });

  function handleMouseEnterExistingObject() {
    setIsCreating(false);
  }

  function handleTextInputObject(e) {
    console.log(e.target.value);
  }

  function handleObjectColourUpdate(index, colour, e) {
    console.log(arguments);
    let local_objects = [...objects];
    let obj = {
      ...local_objects[index],
      backgroundColor: colour,
    };
    local_objects[index] = obj;
    setObjects(local_objects);
  }

  function handleObjectDrag(index, e) {
    // fun trivia: cannot drag on to another item, although in this case we *can* do that
    // since we are simply doing arbitrary positioning
    if (e.clientY === 0) {
      return;
    }

    // todo: fix the positioning on a drag
    let rect = e.target.getBoundingClientRect();
    console.log("rect is ", rect);

    let local_objects = [...objects];
    let obj = {
      ...local_objects[index],
      top: `${e.clientY}px`,
    };
    local_objects[index] = obj;
    setObjects(local_objects);
  }

  return (
    <div>
      {(() => {
        if (isCreating) {
          return (
            <div
              className="object"
              onMouseUp={handleMouseUp}
              style={{
                top: `${initialClientDown}px`,
                height: `${currentClientMousePosition - initialClientDown}px`,
              }}
            >
              CREATING{" "}
            </div>
          );
        }
      })()}
      {verticalView}
      {objects.map((v, index) => {
        return (
          <div
            draggable
            className="object"
            onDrag={handleObjectDrag.bind(null, index)}
            onMouseEnter={handleMouseEnterExistingObject}
            style={v}
          >
            <div className="input-container">
              <textarea onInput={handleTextInputObject}></textarea>
              <ColourSelectPanel
                id={index}
                onClickFn={handleObjectColourUpdate.bind(null, index)}
              ></ColourSelectPanel>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;
