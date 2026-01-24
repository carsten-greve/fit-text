import { useState, useCallback, useEffect } from 'react';
import { useApp } from '../AppProvider';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export const BackgroundDropbox = () => {
  const [file, setFile] = useState(null);
  const { imageUrl, setImageUrl } = useApp();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
      const url = URL.createObjectURL(acceptedFiles[0]);
      setImageUrl(url);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/png': ['.png'], 'image/jpeg': ['.jpeg, .jpg'] },
    multiple: false
  });

  return (
    <div 
      {...getRootProps()} 
      className={`flex-none border-2 border-dashed rounded-lg p-2 w-50 text-center transition-colors cursor-pointer flex items-center justify-center  ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:border-blue-400'}`}
    >
      <input {...getInputProps()} />
      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
      <p className={`text-gray-600 ${file ? "truncate" : ""}`}>
        {file ? `Selected: ${file.name}` : "Drag & drop optional background image here, or click to select"}
      </p>
    </div>
  );
};
