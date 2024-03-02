import React, { useState } from 'react';
import axios from 'axios';

function MyComponent() {
  const [imageUrl, setImageUrl] = useState(null);

  const handleFetchImage = () => {
    // Replace 'http://192.168.2.150/imaging/Intern/folio-2.jpg' with the actual URL of your image
    const imagePath = 'http://192.168.2.150/imaging/Intern/folio-2.jpg'; // Change this URL

    fetch(imagePath)
      .then(response => response.blob())
      .then(blob => {
        const imageData = new FormData();
        imageData.append('image', blob); // Append the image blob to FormData
        
        const config = { // Optional headers for image data
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        };

        axios.post('http://localhost:3000/api/user/upload', imageData, config)
          .then(response => {
            console.log('Image sent:', response.data);
            setImageUrl(imagePath); // Update imageUrl after successfully sending the image
          })
          .catch(error => console.error('Error sending image:', error));
      })
      .catch(error => console.error('Error fetching image:', error));
  };

  return (
    <div>
      <button onClick={handleFetchImage}>Fetch and Send Image</button>
      {imageUrl && <img src={imageUrl} alt="Fetched Image" />}
    </div>
  );
}

export default MyComponent;
