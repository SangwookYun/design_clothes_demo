import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import shirt from "./asset/shirt.png";
function App() {
  const boxRef = useRef(null);
  const containerRef = useRef(null);
  const isClicked = useRef(false);
  const isClickedIcon = useRef(false);
  const iconRef = useRef(null);
  const [userImage, setUserImage] = useState(null);
  const [centeredX, setCenteredX] = useState(false);
  const [centeredY, setCenteredY] = useState(false);
  const [fileExist, setFileExist] = useState(false);
  const coords = useRef({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
  });
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    setFileExist(true);

    reader.onload = (e) => {
      setUserImage(e.target.result);
      const box = boxRef.current;
      const icon = iconRef.current;

      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const aspectRatio = img.width / img.height;

        // Set the backgroundImage and adjust the width and height of the box
        box.style.backgroundImage = `url(${e.target.result})`;
        box.style.width = "100px"; // Set your desired width
        box.style.height = `${100 / aspectRatio}px`; // Adjust the height based on the aspect ratio

        // icon.style.left = `${100 - 10}px`;
        // icon.style.top = `${100 / aspectRatio - 10}px`; // Adjust the height based on the aspect ratio
        // Set the initial position for the icon in the bottom right corner of the box
        icon.style.left = `${box.clientWidth - 12}px`;
        icon.style.top = `${box.clientHeight - 12}px`;
      };
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!boxRef.current || !containerRef.current || !iconRef.current) return;

    const box = boxRef.current;
    const container = containerRef.current;
    const icon = iconRef.current;

    const onMouseDown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("OnMouseDown");
      isClicked.current = true;
      coords.current.startX = e.clientX;
      coords.current.startY = e.clientY;
    };
    console.log(centeredX);
    const onMouseUp = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("OnMouseUp");
      isClicked.current = false;
      coords.current.lastX = box.offsetLeft;
      coords.current.lastY = box.offsetTop;
    };
    const onMouseMove = (e) => {
      if (!isClicked.current && !isClickedIcon.current) return;
      if (e.buttons === 1) {
        if (isClicked.current) {
          const nextX =
            e.clientX - coords.current.startX + coords.current.lastX;
          const nextY =
            e.clientY - coords.current.startY + coords.current.lastY;
          // Calculate the boundaries to restrict box movement inside the container

          const containerWidth = container.clientWidth;
          const containerHeight = container.clientHeight;
          const boxWidth = box.clientWidth;
          const boxHeight = box.clientHeight;
          const iconHeight = icon.clientHeight;
          const iconWidth = icon.clientWidth;

          const centerThreshold = 1; // Adjust this value based on your preference

          // Calculate the distance from the current box position to the center
          const distanceToCenterX = Math.abs(
            nextX + boxWidth / 2 - containerWidth / 2
          );
          const distanceToCenterY = Math.abs(
            nextY + boxHeight / 2 - containerHeight / 2
          );

          // Check if the box is close enough to the center
          const isNearCenterX = distanceToCenterX <= centerThreshold;
          const isNearCenterY = distanceToCenterY <= centerThreshold;
          if (isNearCenterX && isNearCenterY) {
            // Snap to the center
            box.style.left = `${containerWidth / 2 - boxWidth / 2}px`;
            box.style.top = `${containerHeight / 2 - boxHeight / 2}px`;
            icon.style.left = `${
              containerWidth / 2 - boxWidth / 2 + boxWidth - iconWidth - 3
            }px`;
            icon.style.top = `${
              containerHeight / 2 - boxHeight / 2 + boxHeight - iconHeight - 3
            }px`;

            setCenteredX(true);
            setCenteredY(true);
          } else if (isNearCenterX) {
            box.style.left = `${containerWidth / 2 - boxWidth / 2}px`;
            icon.style.left = `${
              containerWidth / 2 - boxWidth / 2 + boxWidth - iconWidth - 3
            }px`;
            setCenteredX(true);
          } else if (isNearCenterY) {
            box.style.top = `${containerHeight / 2 - boxHeight / 2}px`;
            icon.style.top = `${
              containerHeight / 2 - boxHeight / 2 + boxHeight - iconHeight - 3
            }px`;
            setCenteredY(true);
          } else {
            setCenteredY(false);
            setCenteredX(false);
            if (nextX >= 0 && nextX + boxWidth <= containerWidth) {
              box.style.left = `${nextX}px`;
              icon.style.left = `${nextX + boxWidth - iconWidth - 3}px`;
            } else if (nextX >= 0 && nextX + boxWidth > containerWidth) {
              box.style.left = `${containerWidth - boxWidth}px`;
              icon.style.left = `${containerHeight - iconHeight - 3}px`;
            } else {
              box.style.left = `${0}px`;
              icon.style.left = `${boxWidth - iconWidth - 3}px`;
            }
            if (nextY >= 0 && nextY + boxHeight <= containerHeight) {
              box.style.top = `${nextY}px`;
              icon.style.top = `${nextY + boxHeight - iconHeight - 3}px`;
            } else if (nextY >= 0 && nextY + boxHeight > containerHeight) {
              box.style.top = `${containerHeight - boxHeight}px`;
              icon.style.top = `${containerHeight - iconHeight - 3}px`;
            } else {
              box.style.top = `${0}px`;
              icon.style.top = `${boxHeight - iconHeight - 3}px`;
            }
          }
        } else if (isClickedIcon.current) {
          // This part handles resizing by dragging the icon
          const newWidth = Math.max(
            e.clientX - box.getBoundingClientRect().left,
            50
          );

          const newHeight = newWidth / (box.clientWidth / box.clientHeight);
          const iconHeight = icon.clientHeight;
          const iconWidth = icon.clientWidth;
          setCenteredY(false);
          setCenteredX(false);
          box.style.width = `${newWidth}px`;
          box.style.height = `${newHeight}px`;
          icon.style.left = `${
            newWidth - iconWidth - 3 + coords.current.lastX
          }px`;
          icon.style.top = `${
            newHeight - iconHeight + coords.current.lastY - 3
          }px`;
        }
      }
    };
    const onMouseDownIcon = (e) => {
      e.stopPropagation();
      e.preventDefault();
      isClickedIcon.current = true;
      console.log("isClicked", isClicked.current);
      console.log("isClickedIcon", isClickedIcon.current);
    };
    const onMouseUpIcon = (e) => {
      e.stopPropagation();
      isClickedIcon.current = false;
      console.log("isClicked", isClicked.current);
      console.log("isClickedIcon", isClickedIcon.current);
    };
    box.addEventListener("mousedown", onMouseDown);
    box.addEventListener("mouseup", onMouseUp);
    container.addEventListener("mousemove", onMouseMove);
    icon.addEventListener("mousedown", onMouseDownIcon);
    icon.addEventListener("mouseup", onMouseUpIcon);
    document.addEventListener("mouseup", onMouseUp);
    const cleanup = () => {
      box.removeEventListener("mousedown", onMouseDown);
      box.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("mousemove", onMouseMove);
      icon.removeEventListener("mousedown", onMouseDownIcon);
      icon.removeEventListener("mouseup", onMouseUpIcon);
      document.addEventListener("mouseup", onMouseUp);
    };
    return cleanup;
  }, []);

  const handleConfirmClick = () => {
    const mergedCanvas = document.getElementById("mergedCanvas");
    const divParent = document.getElementById("divParent");
    mergedCanvas.width = divParent.offsetWidth;
    mergedCanvas.height = divParent.offsetHeight;
    // console.log(divParent.width, divParent.height);
    const ctx = mergedCanvas.getContext("2d");

    const container = document.querySelector(".divParent");
    const box = boxRef.current;

    const containerBgImage = new Image();
    containerBgImage.src = shirt; // Replace with the actual path to your container background image
    containerBgImage.onload = () => {
      console.log("Container background image loaded successfully.");
      ctx.drawImage(
        containerBgImage,
        0,
        0,
        container.clientWidth,
        container.clientHeight,
        0,
        0,
        container.clientWidth,
        container.clientHeight
      );

      const boxImage = new Image();
      boxImage.src = userImage; // userImage is the uploaded image URL
      console.log(container.offsetLeft, box.offsetLeft);
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
    const container = document.querySelector(".container");
    const box = document.querySelector(".box"); // Calculate the new position for the box
    const newLeft = container.clientWidth / 2 - box.clientWidth / 2;
    const icon = iconRef.current;

    // Set the new position for the box
    box.style.left = `${newLeft}px`;
    icon.style.left = `${newLeft + box.clientWidth - 13}px`;
    setCenteredX(true);
    coords.current.lastX = box.offsetLeft;
    coords.current.lastY = box.offsetTop;
  };

  const handleClickLeft = () => {
    const container = document.querySelector(".container");
    const box = document.querySelector(".box");
    const icon = iconRef.current;

    // Calculate the new position for the box and icon
    const newLeft = 0;
    const newTop = box.offsetTop;

    // Set the new position for the box
    box.style.left = `${newLeft}px`;
    box.style.top = `${newTop}px`;

    // Set the position for the icon in the bottom right corner of the box
    icon.style.left = `${newLeft + box.clientWidth - 13}px`;
    icon.style.top = `${newTop + box.clientHeight - 13}px`; // Update centered state
    setCenteredX(false);
    coords.current.lastX = box.offsetLeft;
    coords.current.lastY = box.offsetTop;
  };

  const handleClickRight = () => {
    const container = document.querySelector(".container");
    const box = document.querySelector(".box");
    const icon = iconRef.current;

    // Calculate the new position for the box and icon
    const newLeft = container.clientWidth - box.clientWidth;
    const newTop = box.offsetTop;

    // Set the new position for the box
    box.style.left = `${newLeft}px`;
    box.style.top = `${newTop}px`;

    // Set the position for the icon in the bottom right corner of the box
    icon.style.left = `${newLeft + box.clientWidth - 13}px`;
    icon.style.top = `${newTop + box.clientHeight - 13}px`; // Update centered state
    setCenteredX(false);
    coords.current.lastX = box.offsetLeft;
    coords.current.lastY = box.offsetTop;
  };

  const handleClickTop = () => {
    const container = document.querySelector(".container");
    const box = document.querySelector(".box");
    const icon = iconRef.current;

    // Calculate the new position for the box and icon
    const newLeft = box.offsetLeft;
    const newTop = 0;

    // Set the new position for the box
    box.style.left = `${newLeft}px`;
    box.style.top = `${newTop}px`;

    // Set the position for the icon in the bottom right corner of the box
    icon.style.left = `${newLeft + box.clientWidth - 13}px`;
    icon.style.top = `${newTop + box.clientHeight - 13}px`;
    setCenteredY(false);
    coords.current.lastX = box.offsetLeft;
    coords.current.lastY = box.offsetTop;
  };

  const handleClickMiddle = () => {
    const container = document.querySelector(".container");
    const box = document.querySelector(".box");
    const icon = iconRef.current;

    // Calculate the new position for the box and icon
    const newLeft = container.clientWidth / 2 - box.clientWidth / 2;
    const newTop = container.clientHeight / 2 - box.clientHeight / 2;

    // Set the new position for the box
    // box.style.left = `${newLeft}px`;
    box.style.top = `${newTop}px`;

    // Set the position for the icon in the bottom right corner of the box
    // icon.style.left = `${newLeft + box.clientWidth - 13}px`;
    icon.style.top = `${newTop + box.clientHeight - 13}px`;
    setCenteredY(true);
    coords.current.lastX = box.offsetLeft;
    coords.current.lastY = box.offsetTop;
  };

  const handleClickBottom = () => {
    const container = document.querySelector(".container");
    const box = document.querySelector(".box");
    const icon = iconRef.current;

    // Calculate the new position for the box and icon
    const newLeft = box.offsetLeft;
    const newTop = container.clientHeight - box.clientHeight;

    // Set the new position for the box
    box.style.left = `${newLeft}px`;
    box.style.top = `${newTop}px`;

    // Set the position for the icon in the bottom right corner of the box
    icon.style.left = `${newLeft + box.clientWidth - 13}px`;
    icon.style.top = `${newTop + box.clientHeight - 13}px`;
    setCenteredY(false);
    coords.current.lastX = box.offsetLeft;
    coords.current.lastY = box.offsetTop;
  };

  return (
    <main>
      <div className="divParent" id="divParent">
        <div ref={containerRef} className="container">
          <div
            ref={boxRef}
            className="box"
            style={{
              backgroundImage: `url(${userImage})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              display: fileExist ? "block" : "none",
            }}
          ></div>
          <div
            className="icon"
            style={{ display: fileExist ? "block" : "none" }}
            ref={iconRef}
          />
          {centeredX && <div className="center-line vertical" />}
          {centeredY && <div className="center-line horizontal" />}
        </div>
      </div>
      <div>
        <input type="file" onChange={handleImageUpload} accept="image/*" />
      </div>
      <div>
        <button onClick={handleClickCenter}>Center</button>
        <button onClick={handleClickLeft}>Left</button>
        <button onClick={handleClickRight}>Right</button>
        <button onClick={handleClickTop}>Top</button>
        <button onClick={handleClickMiddle}>Middle</button>
        <button onClick={handleClickBottom}>Bottom</button>
      </div>
      <button
        style={{ width: "150px", display: "inline-block" }}
        onClick={handleConfirmClick}
      >
        Confirm
      </button>
      {/* <div id="mergedImageContainer"></div> */}
      <canvas id="mergedCanvas" style={{ border: "1px solid black" }}></canvas>
    </main>
  );
}

export default App;
