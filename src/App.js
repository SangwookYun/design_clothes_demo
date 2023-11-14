import React, { useState } from "react";
import "./App.css";
import ImageUploadArea from "./ImageUploadArea";

function App() {
  return (
    <>
      {/* <div className="app"> */}
      <div className="divParent">
        <ImageUploadArea />
      </div>
      <label for="input-file">Update Image</label>
      {/* </div> */}
    </>
  );
}

export default App;
//
//I am using react and I have one div, which has a background image. Inside of this div, I have child image file and two images looks stack or overlap, which means the child image is on the background image from the parent . What I want to do is to extract both image to one image, as it looks on the browser.

//-This is a code currently.
