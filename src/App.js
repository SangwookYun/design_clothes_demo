import React, { useState } from "react";
import ImageUploadArea from "./ImageUploadArea";
import PracRef from "./component/PracRef.js";
import DesignModule from "./component/designModule";
import shirt from "./asset/shirt.png";
function App() {
  return (
    <>
      <DesignModule
        backgroundImage={shirt}
        canvasTop={0}
        canvasLeft={0}
        canvasWidth={40}
        canvasHeight={50}
        coef={4}
      />
    </>
  );
}

export default App;
//
//I am using react and I have one div, which has a background image. Inside of this div, I have child image file and two images looks stack or overlap, which means the child image is on the background image from the parent . What I want to do is to extract both image to one image, as it looks on the browser.

//-This is a code currently.
