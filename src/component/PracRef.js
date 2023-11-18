import React, { useRef, useEffect, useState } from "react";

const PracRef = ({ height }) => {
  // create a ref
  const divElement = useRef();

  // trigger on the first render of the component
  useEffect(() => {
    // get the height of the div element
    console.log("The height of the div is: ", divElement.current.offsetHeight);
  }, []);

  return (
    <div ref={divElement} style={{ height: height }}>
      <h1>Learn about useRef!</h1>
    </div>
  );
};
export default PracRef;
