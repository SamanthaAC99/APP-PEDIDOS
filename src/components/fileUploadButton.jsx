import React from 'react';


const FileUploadButton = ({ onFileUpload }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    onFileUpload(file);
  };

  return (
    <div className="file-upload-button">
      <input type="file" id="file-input" onChange={handleFileChange} />
      <label htmlFor="file-input">Subir Logo</label>
    </div>
  );
};

export default FileUploadButton;