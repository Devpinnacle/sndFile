// src/components/FileUploadForm.js
import React, { useState } from 'react';
import axios from 'axios';

const FileUploadForm = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      formData.append('image', file);
      console.log(formData)
      const response = await axios.post('http://localhost:3000/api/image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>File Upload</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="file" className="form-control-file" onChange={handleFileChange} />
        </div>
        <button type="submit" className="btn btn-primary">Upload</button>
      </form>
      {message && <div className="mt-3 alert alert-info">{message}</div>}
    </div>
  );
};

export default FileUploadForm;
