import React from "react";

import classes from "./Button.css";

const button = (props) => (
  <button
    disabled={props.disabled}
    className={[classes.Button, classes[props.btnType]].join(" ")}
    // join() to transform the array in a string
    onClick={props.clicked}
  >
    {props.children}
  </button>
);

export default button;

// CHILDREN:
// {props.children} WILL RECEIVE "CANCEL"
// <Button btnType="Danger">CANCEL</Button>
