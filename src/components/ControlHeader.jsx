import { Textarea } from '@headlessui/react';
import { SegmentControls } from './SegmentControls';
import { Dropbox } from './Dropbox';
import { FontSelection } from './FontSelection';

const ControlHeader = () => {
  return (
    <header className="flex h-30 items-center gap-4 border-b bg-white px-6 shadow-sm z-10">

      <Dropbox />
      <SegmentControls />

      {/* Text Input Area */}
      <div className="flex-1 min-w-50 h-full p-2">
        <Textarea 
          className="w-full h-full p-2 text-sm border-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          placeholder="Enter text to fit..."
        />
      </div>

      <FontSelection />
    </header>
  );
};

export default ControlHeader
