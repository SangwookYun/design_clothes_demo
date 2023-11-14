import { useState, useEffect } from "react";
import "./App.css";

const ImageUploadArea = () => {
  const [userImage, setUserImage] = useState(null);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setUserImage(e.target.result);
    };

    reader.readAsDataURL(file);
  };
  useEffect(() => {
    if (imagePosition.x === 0) {
      console.log("WORKLING!");
    }
  });
  return (
    <>
      <div className="upload-area">
        {userImage && (
          <img
            src={userImage}
            alt="User's Image"
            className="uploaded-image"
            draggable="true"
            onDragStart={(e) => {
              console.log("ondragstart");
            }}
            onDrag={(e) => {}}
            onDragEnd={(e) => {
              const uploadArea = document.querySelector(".upload-area");
              const rect = uploadArea.getBoundingClientRect();

              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              console.log(x, y);
              setImagePosition({ x, y });
            }}
            style={{
              position: "absolute",
              left: imagePosition.x,
              top: imagePosition.y,
            }}
          />
          // </div>
        )}
      </div>
      <input type="file" onChange={handleImageUpload} accept="image/*" />
    </>
  );
};

export default ImageUploadArea;
