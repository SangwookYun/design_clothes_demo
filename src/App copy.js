import shirt from "./asset/shirt.png";
import "./App.css";
import { useEffect, useRef, useState } from "react";

function App() {
  const [customImage, setCustomImage] = useState(null);
  const myElementRef = useRef(null);

  const handleImageUpload = (event) => {
    const uploadedImage = event.target.files[0];
    setCustomImage(URL.createObjectURL(uploadedImage));
  };
  let element;
  let isDragging = false;
  let initialMouseX, initialMouseY, initialElementX, initialElementY;
  useEffect(() => {
    const element = myElementRef.current;
    if (element) {
      element.addEventListener("mousedown", (e) => {
        isDragging = true;
        initialMouseX = e.clientX;
        initialMouseY = e.clientY;
        initialElementX = element.offsetLeft;
        initialElementY = element.offsetTop;
        element.style.cursor = "grabbing"; // Change cursor style while dragging
      });
      document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - initialMouseX;
        const deltaY = e.clientY - initialMouseY;

        element.style.left = initialElementX + deltaX + "px";
        element.style.top = initialElementY + deltaY + "px";
      });

      document.addEventListener("mouseup", () => {
        isDragging = false;
        element.style.cursor = "grab";
      });
    }
  }, [element]);

  return (
    <div className="App">
      <div className="clothing-container">
        <img src={shirt} />
        <div className="area"></div>
        {customImage && (
          <img ref={myElementRef} src={customImage} className="custom-image" />
        )}
      </div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
    </div>
  );
}

export default App;
