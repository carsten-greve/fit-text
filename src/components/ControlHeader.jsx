import { useState, useRef } from 'react';
import { Listbox, ListboxButton, ListboxOptions, Field, Label, Textarea } from '@headlessui/react';
import { Image as ImageIcon, Type, Settings2, Download, Upload, FileText } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const ControlHeader = () => {
  const [file, setFile] = useState(null);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
    }
  };

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

      {/* Node/Segment Controls */}
      <div className="flex flex-col gap-1 border-l pl-4">
        <span className="text-[10px] font-bold uppercase text-gray-500">Selected Segment</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Straight</button>
          <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">Spline</button>
        </div>
      </div>

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
