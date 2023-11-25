import React, { useState } from "react";
import DesignModule from "./component/designModule";
import shirt from "./asset/shirt.png";
import shirt_front from "./asset/shirt_front.png";
import shirt_back from "./asset/shirt_back.png";
import shirt_side from "./asset/shirt_side.png";
function App() {
  return (
    <>
      <div>Front</div>
      <DesignModule
        backgroundImage={shirt_front}
        canvasTop={90}
        canvasLeft={145}
        canvasWidth={40}
        canvasHeight={50}
        coef={4}
      />

      <div>Back</div>
      <DesignModule
        backgroundImage={shirt_back}
        canvasTop={90}
        canvasLeft={145}
        canvasWidth={40}
        canvasHeight={50}
        coef={4}
      />

      <div>Side</div>
      <DesignModule
        backgroundImage={shirt_side}
        canvasTop={200}
        canvasLeft={170}
        canvasWidth={30}
        canvasHeight={20}
        coef={4}
      />
    </>
  );
}

export default App;
