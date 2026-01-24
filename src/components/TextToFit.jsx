import { useApp } from '../AppProvider';
import { Textarea } from '@headlessui/react';

export const TextToFit = () => {
  const { textToFit, setTextToFit } = useApp();

  return (
    <div className="flex-1 min-w-50 h-full py-2">
      <Textarea 
        className="w-full h-full p-2 text-sm border-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        value={textToFit}
        placeholder="Enter text to fit..."
        onChange={e => setTextToFit(e.target.value)}
      />
    </div>
  );
}
