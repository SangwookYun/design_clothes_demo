import React, { useState, useEffect, useRef } from "react";
import "./App.css";
// import shirt from "./asset/shirt.png";
const DesignModule = ({
  backgroundImage,
  canvasTop,
  canvasLeft,
  canvasWidth,
  canvasHeight,
  coef,
}) => {
  const boxRef = useRef(null);
  const canavasAreaRef = useRef(null);
  const designPanelRef = useRef(null);
  const horizontalLineRef = useRef(null);
  const verticalLineRef = useRef(null);

  // component state
  const defaultWidth = 30;
  const [userImage, setUserImage] = useState(null);
  const [centeredX, setCenteredX] = useState(false);
  const [centeredY, setCenteredY] = useState(false);
  const [fileExist, setFileExist] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState("");
  const [originalRatio, setOriginalRatio] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);

  const handleImageUpload = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.target.files[0];
    if (!file) {
      return;
    }
    // Check if the file type is an image (e.g., jpg or png)
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (jpg or png).");
      return;
    }
    const reader = new FileReader();
    setFileExist(true);
    setSelectedOpt("");
    reader.onload = (e) => {
      setUserImage(e.target.result);
      const box = boxRef.current;
      const canvasArea = canavasAreaRef.current;
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const originWidth = defaultWidth * coef;
        // Set the backgroundImage and adjust the width and height of the box
        box.style.backgroundImage = `url(${e.target.result})`;

        setWidth(originWidth);
        setHeight(originWidth / aspectRatio);
        setOriginalRatio(100 / aspectRatio);

        const originalLeft = canvasArea.clientWidth / 2 - originWidth / 2;

        const originalTop =
          canvasArea.clientHeight / 2 - originWidth / aspectRatio / 2;

        setLeft(originalLeft);
        setTop(originalTop);
      };
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const handleDocumentClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const designPanel = designPanelRef.current;
      const canvasArea = canavasAreaRef.current;
      const horizontalLine = horizontalLineRef.current;
      const verticalLine = verticalLineRef.current;

      // Check if the click is outside the designPanel
      if (designPanel.contains(e.target)) {
        canvasArea.style.border = "1px solid transparent";
        if (horizontalLine) {
          horizontalLine.style.visibility = "hidden";
        }
        if (verticalLine) {
          verticalLine.style.visibility = "hidden";
        }
      }
    };
    const handleDocumentClick2 = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const designPanel = designPanelRef.current;
      const canvasArea = canavasAreaRef.current;

      const horizontalLine = horizontalLineRef.current;
      const verticalLine = verticalLineRef.current;

      // Check if the click is outside the designPanel
      if (designPanel.contains(e.target)) {
        // Update the container border to 0px
        canvasArea.style.border = "1px solid black";
        if (horizontalLine) {
          horizontalLine.style.visibility = "visible";
        }
        if (verticalLine) {
          verticalLine.style.visibility = "visible";
        }
      }
    };
    if (!boxRef.current || !canavasAreaRef.current) return;

    const canvasArea = canavasAreaRef.current;
    const designPanel = designPanelRef.current;

    designPanel.addEventListener("click", handleDocumentClick);
    canvasArea.addEventListener("click", handleDocumentClick2);
    const cleanup = () => {
      designPanel.removeEventListener("click", handleDocumentClick);
      canvasArea.removeEventListener("click", handleDocumentClick2);
    };
    return cleanup;
  }, []);

  useEffect(() => {}, [top, left, width, height, userImage]);

  const handleConfirmClick = () => {
    const mergedCanvas = document.getElementById("mergedCanvas");
    const designPanel = document.querySelector(".designPanel");
    mergedCanvas.width = designPanel.offsetWidth;
    mergedCanvas.height = designPanel.offsetHeight;
    const ctx = mergedCanvas.getContext("2d");

    const canvasArea = document.querySelector(".designPanel");
    const box = boxRef.current;

    const canvasAreaBgImage = new Image();
    canvasAreaBgImage.src = backgroundImage; // Replace with the actual path to your container background image
    canvasAreaBgImage.onload = () => {
      ctx.drawImage(
        canvasAreaBgImage,
        0,
        0,
        canvasArea.clientWidth,
        canvasArea.clientHeight,
        0,
        0,
        canvasArea.clientWidth,
        canvasArea.clientHeight
      );

      const boxImage = new Image();
      boxImage.src = userImage; // userImage is the uploaded image URL
      boxImage.onload = () => {
        ctx.drawImage(
          boxImage,
          box.offsetLeft + 155,
          box.offsetTop + 100,
          box.clientWidth,
          box.clientHeight
        );
      };
    };
  };

  const handleClickCenter = () => {
    const canvasArea = document.querySelector(".canvasArea");
    const box = document.querySelector(".box"); // Calculate the new position for the box
    const newLeft = canvasArea.clientWidth / 2 - box.clientWidth / 2;
    // Set the new position for the box
    box.style.left = `${newLeft}px`;
    setCenteredX(true);
  };

  const handleClickLeft = () => {
    const box = document.querySelector(".box");

    // Calculate the new position for the box and icon
    const newLeft = 0;
    const newTop = box.offsetTop;

    // Set the new position for the box
    box.style.left = `${newLeft}px`;
    box.style.top = `${newTop}px`;

    // Set the position for the icon in the bottom right corner of the box
    setCenteredX(false);
  };

  const handleClickRight = () => {
    const canvasArea = document.querySelector(".canvasArea");
    const box = document.querySelector(".box");

    // Calculate the new position for the box and icon
    const newLeft = canvasArea.clientWidth - box.clientWidth;
    const newTop = box.offsetTop;

    // Set the new position for the box
    box.style.left = `${newLeft}px`;
    box.style.top = `${newTop}px`;

    // Set the position for the icon in the bottom right corner of the box
    setCenteredX(false);
  };

  const handleClickTop = () => {
    const box = document.querySelector(".box");

    // Calculate the new position for the box and icon
    const newLeft = box.offsetLeft;
    const newTop = 0;

    // Set the new position for the box
    box.style.left = `${newLeft}px`;
    box.style.top = `${newTop}px`;

    // Set the position for the icon in the bottom right corner of the box
    setCenteredY(false);
  };

  const handleClickMiddle = () => {
    const canvasArea = document.querySelector(".canvasArea");
    const box = document.querySelector(".box");

    // Calculate the new position for the box and icon
    const newTop = canvasArea.clientHeight / 2 - box.clientHeight / 2;

    // Set the new position for the box
    // box.style.left = `${newLeft}px`;
    box.style.top = `${newTop}px`;

    // Set the position for the icon in the bottom right corner of the box
    // icon.style.left = `${newLeft + box.clientWidth - 13}px`;
    setCenteredY(true);
  };

  const handleClickBottom = () => {
    const canvasArea = document.querySelector(".canvasArea");
    const box = document.querySelector(".box");

    // Calculate the new position for the box and icon
    const newLeft = box.offsetLeft;
    const newTop = canvasArea.clientHeight - box.clientHeight;

    // Set the new position for the box
    box.style.left = `${newLeft}px`;
    box.style.top = `${newTop}px`;

    // Set the position for the icon in the bottom right corner of the box
    setCenteredY(false);
  };

  const sizeOptions = [15, 20, 25, 30, 35, 40];
  const handleSelectChange = (event) => {
    const canvasArea = canavasAreaRef.current;
    const selectedValue = event.target.value;

    const calculatedWidth = selectedValue * coef;
    const calculatedHeight = selectedValue * coef * (originalRatio / 10000);

    const newLeft = canvasArea.clientWidth / 2 - calculatedWidth / 2;

    const newTop =
      canvasArea.clientHeight / 2 - calculatedWidth / (100 / originalRatio) / 2;

    setSelectedOpt(selectedValue);
    setWidth(calculatedWidth);
    setHeight(calculatedHeight * 100);
    setLeft(newLeft);
    setTop(newTop);
  };
  return (
    <>
      <div className='container'>
        <div
          className='designPanel'
          style={{ backgroundImage: `url(${backgroundImage})` }}
          ref={designPanelRef}
        >
          <div
            ref={canavasAreaRef}
            className='canvasArea'
            style={{
              width: canvasWidth * coef,
              height: canvasHeight * coef,
              top: canvasTop,
              left: canvasLeft,
            }}
          >
            <div
              ref={boxRef}
              className='box'
              style={{
                backgroundImage: `url(${userImage})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                display: fileExist || centeredX || centeredY ? "block" : "none",
                width: width,
                height: height,
                top: `${top}px`,
                left: `${left}px`,
              }}
            ></div>

            {centeredX && (
              <div ref={verticalLineRef} className='center-line vertical' />
            )}
            {centeredY && (
              <div ref={horizontalLineRef} className='center-line horizontal' />
            )}
          </div>
        </div>
        <div className='controllerPanel'>
          <div className='controller'>
            <div className='subControllerGroup flexColumn'>
              <label className='label'>Step1. Upload an Img file </label>
              <input
                type='file'
                onChange={handleImageUpload}
                style={{ margin: "auto", width: "80%" }}
                accept='image/*'
              />
            </div>
            <div className='subControllerGroup flexColumn'>
              <label className='label'>Step2. Select size of the Width</label>
              <select
                disabled={!fileExist}
                value={selectedOpt}
                onChange={handleSelectChange}
                style={{ width: "80%", margin: "auto" }}
              >
                <option value=''>Select...</option>
                {sizeOptions.map((opt, idx) => {
                  const calculatedValue = (opt * originalRatio) / 100;
                  if (calculatedValue > 50) {
                    // If calculated value is greater than 50, disable or remove the option
                    return null; // or you can disable it by adding the 'disabled' attribute
                  }

                  return (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  );
                })}
              </select>
              {fileExist && selectedOpt !== "" ? (
                <p>
                  The image size is {selectedOpt}cm X
                  {((selectedOpt * originalRatio) / 100).toFixed(0)}cm
                </p>
              ) : (
                <p></p>
              )}
            </div>
            <div className='subControllerGroup flexColumn'>
              <label className='label'>
                Step3. Select horizontal alignment
              </label>
              <div className='flexRow buttonGroup'>
                <button disabled={!fileExist} onClick={handleClickLeft}>
                  Left
                </button>
                <button disabled={!fileExist} onClick={handleClickCenter}>
                  Center
                </button>
                <button disabled={!fileExist} onClick={handleClickRight}>
                  Right
                </button>
              </div>
            </div>
            <div className='subControllerGroup flexColumn'>
              <label className='label'>Step4. Select vertical alignment</label>
              <div className='flexRow buttonGroup'>
                <button disabled={!fileExist} onClick={handleClickTop}>
                  Top
                </button>
                <button disabled={!fileExist} onClick={handleClickMiddle}>
                  Middle
                </button>
                <button disabled={!fileExist} onClick={handleClickBottom}>
                  Bottom
                </button>
              </div>
            </div>

            <div className='subControllerGroup' style={{ textAlign: "center" }}>
              <button
                style={{
                  width: "80%",
                }}
                onClick={handleConfirmClick}
                disabled={!fileExist}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
      <canvas id='mergedCanvas' style={{ border: "1px solid black" }}></canvas>
    </>
  );
};

export default DesignModule;
