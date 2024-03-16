"use client"

import { useState } from 'react';

const HomePage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedText, setProcessedText] = useState('');


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
  
      try {
        const response = await fetch('http://127.0.0.1:8000/process-document/', {
          method: 'POST',
          body: formData,
          // You don't need to explicitly set Content-Type header for FormData.
          // Fetch API does that automatically.
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        const result = await response.json();
        console.log(result.generations[0][0].text);
        setProcessedText(result.generations[0][0].text)
        // Handle the response data as needed...
      } catch (error) {
        console.error('Uploading failed:', error);
      }
  
      // Reset the selected file after handling upload
      setSelectedFile(null);
    }
    else {
      console.log("no selected file")
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Our Health Document Assistant
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Simplifying your medical documents into understandable language.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <input type="file" onChange={handleFileChange} className="file-input" />
          {selectedFile && (
            <div className="mt-4">
              <button
                onClick={handleFileUpload}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Upload Document
              </button>
            </div>
          )}
          <div>
            <button
              // Placeholder - implement scanning functionality
              onClick={() => console.log('Implement scanning functionality')}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Scan Document
            </button>
          </div>
        </div>
        {processedText && (
          <div className="mt-4 text-center text-sm text-gray-800">
            <h3 className="font-bold">Processed Document:</h3>
            <p>{processedText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
