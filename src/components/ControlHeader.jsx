import { Textarea } from '@headlessui/react';
import { SegmentControls } from './SegmentControls';
import { BackgroundDropbox } from './BackgroundDropbox';
import { FontSelection } from './FontSelection';
import { PdfSaver } from './PdfSaver';

const ControlHeader = () => {
  return (
    <header className="flex h-30 items-center gap-2 border-b bg-white px-3 shadow-sm">

      <BackgroundDropbox />
      <SegmentControls />

      {/* Text Input Area */}
      <div className="flex-1 min-w-50 h-full py-2">
        <Textarea 
          className="w-full h-full p-2 text-sm border-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          placeholder="Enter text to fit..."
        />
      </div>

      <FontSelection />
      <PdfSaver />
    </header>
  );
};

export default ControlHeader
