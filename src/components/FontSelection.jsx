import { useApp } from '../AppProvider';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { Type, ListChevronsUpDown, ChevronDownIcon, CheckIcon, ListIndentIncrease, ChartNoAxesGantt } from 'lucide-react';
import { clsx } from 'clsx'
import { getShapeBoundaries } from '../utilities/getShapeBoundaries';
import { getTextLayout } from '../utilities/getTextLayout';
import { FontDropbox } from './FontDropbox';

export const FontSelection = () => {
  const {
    segments,
    sampleCount,
    fontSize,
    setFontSize,
    lineSpacing,
    setLineSpacing,
    textToFit,
    setIsAutoFitting,
    fontList,
    selectedFont,
    setSelectedFont,
    paragraphIndent,
    setParagraphIndent,
    isFirstLineIndent,
    setIsFirstLineIndent,
  } = useApp();

  const autoFit = async (fitType) => {
    try {
      setIsAutoFitting(true);

      const shapeBoundaries = getShapeBoundaries(segments, sampleCount);
      const paragraphsOfWords = textToFit.split(/\n\s*\n/).map(p => p.split(/\s+/));

      let factor = 0.2;
      let isGrowing = true;
      let newFontSize = fontSize;
      let newLineSpacing = lineSpacing;
      let lastFitFontSize = fontSize;
      let lastFitLineSpacing = lineSpacing;
      let limit = 100;
      while (limit-- > 0) {
        const { wordsFitRatio, spaceFitRatio } =
          getTextLayout(paragraphsOfWords, newLineSpacing, shapeBoundaries, selectedFont.name, newFontSize, paragraphIndent, isFirstLineIndent);
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
      <div className="grid grid-rows-2 gap-1 w-20">
        <div className="flex flex-col gap-0.5 -mt-0.5">
          <label className="text-[11px] text-slate-500 flex items-center gap-1">
            <ListIndentIncrease size={12} /> Indent
          </label>
          <div className="flex flex-row gap-1">
            <input 
              type="number"
              min="0"
              step={1}
              value={paragraphIndent}
              onChange={e => setParagraphIndent(parseFloat(e.target.value))}
              className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 pt-2">
          <label className="text-[11px] text-slate-500 flex items-center gap-1">
            <ChartNoAxesGantt size={12} /> First Line
          </label>
          <div className="flex flex-row gap-1">
            <input 
              type="checkbox"
              checked={isFirstLineIndent}
              onChange={e => setIsFirstLineIndent(e.target.checked)}
              className="border border-slate-300 rounded px-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>
      <div className="self-start">
        <div className="w-40 self-start py-2">
          <Listbox value={selectedFont} onChange={setSelectedFont}>
            <ListboxButton
              className={clsx(
                'relative block w-full border-2 rounded-lg bg-black/5 py-1.5 pr-8 pl-3 text-left text-sm/6 text-black',
                'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-black'
              )}
            >
              {selectedFont.name}
              <ChevronDownIcon
                className="group pointer-events-none absolute top-2.5 right-2.5 size-4"
                aria-hidden="true"
              />
            </ListboxButton>
            <ListboxOptions
              anchor="bottom"
              transition
              className={clsx(
                'w-(--button-width) rounded-xl border-2 border-black bg-gray-100 p-1 [--anchor-gap:--spacing(1)]',
                'focus:outline-none transition duration-100 ease-in data-leave:data-closed:opacity-0'
              )}
            >
              {fontList.map((font) => (
                <ListboxOption
                  key={font.id}
                  value={font}
                  className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-black/10"
                >
                  <CheckIcon className="invisible size-4 group-data-selected:visible" />
                  <div className="text-sm/6 text-black">{font.name}</div>
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Listbox>
        </div>
        <FontDropbox />
      </div>
      <div className="grid grid-rows-2 gap-1 w-32">
        <div className="flex flex-col gap-0.5 -mt-0.5">
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
              className="flex-0 w-full rounded bg-blue-600 px-2 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              onClick={() => autoFit('fontSize')}
            >
              Autofit
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
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
