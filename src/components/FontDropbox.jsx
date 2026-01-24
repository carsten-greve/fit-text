import { useApp } from '../AppProvider';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export const FontDropbox = () => {
  const { fontList, setFontList, setSelectedFont, nextFontId, setNextFontId } = useApp();

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles[0]) {
      try {
        let newFont = {id: nextFontId, name: `Font #${nextFontId}` };

        const url = URL.createObjectURL(acceptedFiles[0]);
        const customFont = new FontFace(newFont.name, `url(${url})`);
        const loadedFont = await customFont.load();
        document.fonts.add(loadedFont);

        const reader = new FileReader();
        reader.onload = (event) => {
          newFont.base64Content = event.target.result.split(',')[1];
        };
        reader.readAsDataURL(acceptedFiles[0]);

        setNextFontId(1 + nextFontId);
        setFontList([...fontList, newFont]);
        setSelectedFont(newFont);
      }
      catch (err) {
        console.error("Failed to load dropped font", err);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'font/ttf': ['.ttf'] },
    multiple: false
  });

  return (
    <div 
      {...getRootProps()} 
      className={`flex-none border-2 border-dashed rounded-lg p-2 py-3.5 w-40 text-center transition-colors cursor-pointer flex items-center justify-center  ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:border-blue-400'}`}
    >
      <input {...getInputProps()} />
      <Upload className="w-6 h-6 text-gray-400 mr-2" />
      <p className={`text-gray-600`}>
        Drop TTF Font
      </p>
    </div>
  );
};
