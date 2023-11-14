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

  const coords = useRef({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
  });
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

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

        icon.style.left = `${100 - 5}px`;
        icon.style.top = `${100 / aspectRatio - 5}px`; // Adjust the height based on the aspect ratio
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

      // console.log(coords.current.startX, coords.current.startY);
      // console.log(coords.current.lastX, coords.current.lastY);
    };
    const onMouseUp = (e) => {
      console.log("OnMouseUp");
      isClicked.current = false;
      coords.current.lastX = box.offsetLeft;
      coords.current.lastY = box.offsetTop;
      // console.log(coords.current.startX, coords.current.startY);
      // console.log(coords.current.lastX, coords.current.lastY);
    };
    const onMouseMove = (e) => {
      if (!isClicked.current && !isClickedIcon.current) return;
      if (e.buttons === 1) {
        // console.log("e.clientX", e.clientX);
        if (isClicked.current) {
          // console.log(e.clientX, coords.current.startX, coords.current.lastX);

          const nextX =
            e.clientX - coords.current.startX + coords.current.lastX;
          const nextY =
            e.clientY - coords.current.startY + coords.current.lastY;
          // Calculate the boundaries to restrict box movement inside the container

          const containerWidth = container.clientWidth;
          const containerHeight = container.clientHeight;
          const boxWidth = box.clientWidth;
          const boxHeight = box.clientHeight;
          if (nextX >= 0 && nextX + boxWidth <= containerWidth) {
            box.style.left = `${nextX}px`;
            icon.style.left = `${nextX + boxWidth - 5}px`;
          } else if (nextX >= 0 && nextX + boxWidth > containerWidth) {
            box.style.left = `${containerWidth - boxWidth}px`;
            icon.style.left = `${nextX + boxWidth - 5}px`;
          } else {
            box.style.left = `${0}px`;
            icon.style.left = `${nextX + boxWidth - 5}px`;
          }
          if (nextY >= 0 && nextY + boxHeight <= containerHeight) {
            box.style.top = `${nextY}px`;
            icon.style.top = `${nextY + boxHeight - 5}px`;
          } else if (nextY >= 0 && nextY + boxHeight > containerHeight) {
            box.style.top = `${containerHeight - boxHeight}px`;
            icon.style.top = `${nextY + boxHeight - 5}px`;
          } else {
            box.style.top = `${0}px`;
            icon.style.top = `${nextY + boxHeight - 5}px`;
          }
        } else if (isClickedIcon.current) {
          // This part handles resizing by dragging the icon
          const newWidth = e.clientX - box.getBoundingClientRect().left;
          const newHeight = e.clientY - box.getBoundingClientRect().top;

          if (newWidth > 0 && newHeight > 0) {
            box.style.width = `${newWidth}px`;
            box.style.height = `${newHeight}px`;
            icon.style.left = `${newWidth + coords.current.lastX - 5}px`;
            icon.style.top = `${newHeight + coords.current.lastY - 5}px`;
          }
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

      //   // Now the canvas contains the merged image of the container background and the uploaded image
      //   // You can display it or convert it to a downloadable image

      //   // Create a new image element and set its source to the canvas data URL
      // const mergedImage = new Image();
      // mergedImage.src = mergedCanvas.toDataURL("image/png");

      // Append the image to the page for display
      // document.body.appendChild(mergedImage);
      // };
    };
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
            }}
          ></div>
          <div className="icon" ref={iconRef} />
        </div>
      </div>
      <input type="file" onChange={handleImageUpload} accept="image/*" />
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
