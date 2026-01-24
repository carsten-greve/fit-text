import { BackgroundDropbox } from './components/BackgroundDropbox';
import { SegmentControls } from './components/SegmentControls';
import { TextToFit } from './components/TextToFit';
import { FontSelection } from './components/FontSelection';
import { PdfSaver } from './components/PdfSaver';
import { FitArea } from './components/FitArea';

function App() {
  return (
    <div className='flex flex-col h-screen w-full'>
      <header className="flex h-30 items-center gap-2 border-b bg-white px-3 shadow-sm">
        <BackgroundDropbox />
        <SegmentControls />
        <TextToFit />
        <FontSelection />
        <PdfSaver />
      </header>

      <FitArea />
    </div>
  );
}

export default App
