import { useState, useCallback, useEffect } from 'react';
import { useApp } from '../AppProvider';
import { Listbox, ListboxButton, ListboxOptions, Field, Label, Textarea } from '@headlessui/react';
import { Image as ImageIcon, Type, Settings2, Download, Upload, FileText } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { SegmentControls } from './SegmentControls';

const ControlHeader = () => {
  const [file, setFile] = useState(null);
  const { imageUrl, setImageUrl } = useApp();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
      const url = URL.createObjectURL(acceptedFiles[0]);
      console.log(`acceptedFiles[0]: ${acceptedFiles[0]}`);
      console.log(`image url: ${url}`);
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
    <header className="flex h-30 items-center gap-4 border-b bg-white px-6 shadow-sm z-10">
      
      {/* Drop Box */}
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

      <SegmentControls />

      {/* Text Input Area */}
      <div className="flex-1 min-w-50 h-full p-2">
        <Textarea 
          className="w-full h-full p-2 text-sm border-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          placeholder="Enter text to fit..."
        />
      </div>

      {/* Font Selection (Headless UI Listbox) */}
      <div className="w-48">
        <Listbox>
          <ListboxButton className="w-full flex justify-between p-2 border-2 rounded-md text-sm">
            Select Font <Type className="size-4" />
          </ListboxButton>
          {/* Listbox.Options go here */}
          <ListboxOptions>

          </ListboxOptions>
        </Listbox>
      </div>
    </header>
  );
};

export default ControlHeader
