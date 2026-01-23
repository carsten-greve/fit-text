import { useApp } from '../AppProvider';
import { Listbox, ListboxButton, ListboxOptions, Textarea } from '@headlessui/react';
import { Type, AlignLeft, ListChevronsUpDown } from 'lucide-react';

export const FontSelection = () => {
  const { fontSize, setFontSize, lineSpacing, setLineSpacing } = useApp();

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
      <div className="grid grid-rows-2 gap-2 w-20">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-slate-500 flex items-center gap-1">
            <Type size={12} /> Font Size
          </label>
          <input 
            type="number"
            min="1"
            step={0.5}
            value={fontSize}
            onChange={e => setFontSize(parseFloat(e.target.value))}
            className="w-full border border-slate-300 rounded px-2 py-0.5 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-slate-500 flex items-center gap-1">
            <ListChevronsUpDown size={12} /> Line Spacing
          </label>
          <input 
            type="number"
            min="1"
            step={0.01}
            value={lineSpacing}
            onChange={e => setLineSpacing(parseFloat(e.target.value))}
            className="w-full border border-slate-300 rounded px-2 py-0.5 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>
    </>
  );
}
