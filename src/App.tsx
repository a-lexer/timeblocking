import React, { useState } from "react";
import "./App.css";

function App() {
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
      <button onClick={handleClick}>Add item from ListContainer</button>
      {listItems}
      <HoursBoard />
    </div>
  );
}

function HoursBoard() {
  const [isCreating, setIsCreating] = useState(false);
  const [initialClientDown, setInitialClientDown] = useState(0);
  const [initialClientUp, setInitialClientUp] = useState(0);
  const [currentClientMousePosition, setCurrentClientMousePosition] =
    useState(0);
  const [objects, setObjects] = useState<any[]>([]);

  function handleMouseDown(e) {
    setIsCreating(true);
    setInitialClientDown(e.clientY);
  }
  function handleMouseUp(e) {
    setIsCreating(false);
    setInitialClientUp(e.clientY);
    setObjects([
      ...objects,
      {
        position: "absolute",
        top: `${initialClientDown}px`,
        color: "red",
        width: "800px",
        height: `${currentClientMousePosition - initialClientDown}px`,
        backgroundColor: "rgba(255,0,0,0.4)",
        marginLeft: "45px",
      },
    ]);
    // actually create an object
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

  return (
    <div>
      {(() => {
        if (isCreating) {
          return (
            <div
              style={{
                position: "absolute",
                top: `${initialClientDown}px`,
                color: "red",
                width: "800px",
                height: `${currentClientMousePosition - initialClientDown}px`,
                backgroundColor: "rgba(255,0,0,0.4)",
                marginLeft: "45px",
              }}
            >
              CREATING{" "}
            </div>
          );
        }
      })()}
      {verticalView}
      {objects.map((v) => {
        return <div style={v}></div>;
      })}
    </div>
  );
}

export default App;
