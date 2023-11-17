import React, { useState } from "react";
import ImageUploadArea from "./ImageUploadArea";
import PracRef from "./component/PracRef.js";
import App_ver3 from "./component/App_ver3.js";
function App() {
  return (
    <>
      <div> TEST</div>
      <PracRef height={30} />
      <PracRef height={50} />
      <App_ver3 />
      <App_ver3 />
    </>
  );
}

export default App;
//
//I am using react and I have one div, which has a background image. Inside of this div, I have child image file and two images looks stack or overlap, which means the child image is on the background image from the parent . What I want to do is to extract both image to one image, as it looks on the browser.

//-This is a code currently.
