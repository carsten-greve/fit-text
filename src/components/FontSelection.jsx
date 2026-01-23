import { useApp } from '../AppProvider';
import { Listbox, ListboxButton, ListboxOptions } from '@headlessui/react';
import { Type, AlignLeft, ListChevronsUpDown } from 'lucide-react';
import { getShapeBoundaries } from '../utilities/getShapeBoundaries';
import { getTextLayout } from '../utilities/getTextLayout';

export const FontSelection = () => {
  const { segments, sampleCount, fontFamily, fontSize, setFontSize, lineSpacing, setLineSpacing, textToFit, setIsAutoFitting } = useApp();

  const autoFit = async (fitType) => {
    try {
      setIsAutoFitting(true);

      const shapeBoundaries = getShapeBoundaries(segments, sampleCount);
      const words = textToFit.split(/\s+/);

      let factor = 0.2;
      let isGrowing = true;
      let newFontSize = fontSize;
      let newLineSpacing = lineSpacing;
      let limit = 100;
      let lastFitFontSize = fontSize;
      let lastFitLineSpacing = lineSpacing;
      while (limit-- > 0) {
        const { wordsFitRatio, spaceFitRatio } = getTextLayout(words, newLineSpacing, shapeBoundaries, fontFamily, newFontSize);
        if ((wordsFitRatio === 1 && spaceFitRatio === 1) || factor < 0.001) {
          break;
        }
        else if (wordsFitRatio < 1) {
          factor = isGrowing ? factor / 3 : factor;
          isGrowing = false;
          if (fitType === 'fontSize') {
            newFontSize = Math.round(100 * newFontSize / (1 + factor)) / 100;
          }
          else {
            newLineSpacing = Math.round(1000 * newLineSpacing / (1 + factor)) / 1000;
          }
        }
        else {
          factor = isGrowing ? factor : factor / 3;
          isGrowing = true;
          if (fitType === 'fontSize') {
            lastFitFontSize = newFontSize;
            newFontSize = Math.round(100 * newFontSize * (1 + factor)) / 100;
          }
          else {
            lastFitLineSpacing = newLineSpacing;
            newLineSpacing = Math.round(1000 * newLineSpacing * (1 + factor)) / 1000;
          }
        }
      }

      if (fitType === 'fontSize') {
        setFontSize(lastFitFontSize);
      }
      else {
        setLineSpacing(lastFitLineSpacing);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAutoFitting(false);
    }
  }

  return (
    <>
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
      <div className="grid grid-rows-2 gap-2 w-32">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-slate-500 flex items-center gap-1">
            <Type size={12} /> Font Size
          </label>
          <div className="flex flex-row gap-1">
            <input 
              type="number"
              min="1"
              step={0.5}
              value={fontSize}
              onChange={e => setFontSize(parseFloat(e.target.value))}
              className="w-full border border-slate-300 rounded px-2 py-0.5 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
            />
            <button 
              type="button"
              className="flex-0 w-full rounded bg-blue-600 px-2 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              onClick={() => autoFit('fontSize')}
            >
              Autofit
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-slate-500 flex items-center gap-1">
            <ListChevronsUpDown size={12} /> Line Spacing
          </label>
          <div className="flex flex-row gap-1">
            <input 
              type="number"
              min="1"
              step={0.01}
              value={lineSpacing}
              onChange={e => setLineSpacing(parseFloat(e.target.value))}
              className="w-full border border-slate-300 rounded px-2 py-0.5 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
            />
            <button 
              type="button"
              className="flex-0 w-full rounded bg-blue-600 px-2 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              onClick={() => autoFit('lineSpacing')}
            >
              Autofit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
