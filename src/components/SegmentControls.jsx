import { FoldHorizontal, FoldVertical } from 'lucide-react';
import { useApp } from '../AppProvider';
import { useSegment } from '../hooks/useSegment';
import { isTopOrBottomLine, orientationHorizontal, orientationVertical } from '../utils/segmentUtils';
import { isOnTopOrBottomLine } from '../utils/anchorUtils';

const getQuotientPoint = (p1, p2, dividend, divisor) => {
  return {
    x: ((divisor - dividend) * p1.x + dividend * p2.x) / divisor,
    y: ((divisor - dividend) * p1.y + dividend * p2.y) / divisor,
  }
}

export const SegmentControls = () => {
  const { selectedSegmentId, addSegmentAfter, removeSegment, updateSegment, segmentEndpointAnchors } = useApp();

  const { segment: selectedSegment, nextSegment, prevSegment } = useSegment(selectedSegmentId);

  const isLine = selectedSegment && selectedSegment.type === 'line';
  const isBezier = selectedSegment && selectedSegment.type === 'bezier';
  const isTension = selectedSegment && selectedSegment.type === 'tension';
  const canDelete =
    selectedSegment &&
    !isTopOrBottomLine(selectedSegmentId) &&
    !(isTopOrBottomLine(prevSegment.id) && isTopOrBottomLine(nextSegment.id));
  const canSplit = selectedSegment && !isTopOrBottomLine(selectedSegmentId);

  const handleTensionChange = (e) => {
    if (!selectedSegment) return;

    updateSegment(selectedSegmentId, draft => {
      const newTension = parseFloat(e.target.value);
      draft.tension = (isNaN(newTension) ? 50 : newTension) / 100;
    });
  }

  const handleSplitClick = () => {
    if (!selectedSegment) return;

    const pStart = selectedSegment.points.at(0);
    const pEnd = selectedSegment.points.at(-1);

    const newSegment = {
      type: selectedSegment.type,
      location: selectedSegment.location,
    }

    updateSegment(selectedSegmentId, draft => {
      switch (draft.type) {
        case 'line': {
          const pMid = getQuotientPoint(pStart, pEnd, 1, 2);
          newSegment.points = [pMid, pEnd];
          draft.points[1] = pMid;
          break;
        }

        case 'tension': {
          newSegment.tension = draft.tension;
          const pMid = getQuotientPoint(pStart, pEnd, 1, 2);
          newSegment.points = [pMid, getQuotientPoint(pMid, pEnd, 1, 2), pEnd];
          draft.points = [pStart, getQuotientPoint(pStart, pMid, 1, 2), pMid];
          break;
        }

        case 'bezier': {
          const pMid = getQuotientPoint(pStart, pEnd, 1, 2);
          newSegment.points = [pMid, getQuotientPoint(pMid, pEnd, 1, 3), getQuotientPoint(pMid, pEnd, 2, 3), pEnd];
          draft.points = [pStart, getQuotientPoint(pStart, pMid, 1, 3), getQuotientPoint(pStart, pMid, 2, 3), pMid];
          break;
        }

        default:
          return;
      }
    });

    addSegmentAfter(selectedSegmentId, newSegment);
  }

  const handleTypeClick = (newSegmentType) => {
    updateSegment(selectedSegmentId, draft => {
      if (!draft ||
          draft.type === newSegmentType ||
          isTopOrBottomLine(draft.id)) {
        return;
      }

      const pStart = draft.points.at(0);
      const pEnd = draft.points.at(-1);
      draft.type = newSegmentType;

      switch (newSegmentType) {
        case 'line': {
          draft.points = [pStart, pEnd];
          break;
        }

        case 'tension': {
          draft.tension ??= 0.5;
          draft.points = [pStart, getQuotientPoint(pStart, pEnd, 1, 2), pEnd];
          break;
        }

        case 'bezier': {
          draft.points = [pStart, getQuotientPoint(pStart, pEnd, 1, 3), getQuotientPoint(pStart, pEnd, 2, 3), pEnd];
          break;
        }

        default:
          return;
      }
    });
  }

  const handleDeleteClick = () => {
    if (isTopOrBottomLine(nextSegment.id)) {
      updateSegment(prevSegment.id, draft => {
        draft.points.splice(-1, 1, nextSegment.points[0]);
      });
    }
    else {
      updateSegment(nextSegment.id, draft => {
        draft.points.splice(0, 1, prevSegment.points.at(-1));
      });
    }
    removeSegment(selectedSegmentId);
  }

  const toggleOrientation = (orientation) => {
    if (isTopOrBottomLine(selectedSegmentId)) return;

    const endpointAnchors = segmentEndpointAnchors[selectedSegmentId];
    if ((isOnTopOrBottomLine(endpointAnchors[0]) || isOnTopOrBottomLine(endpointAnchors[1])) && orientation === 'horizontal') {
      return;
    }

    if (selectedSegment.orientation !== orientation && orientation === orientationHorizontal) {
      const y = (selectedSegment.points[0].y + selectedSegment.points.at(-1).y) / 2;
      updateSegment(selectedSegmentId, draft => { draft.points[0].y = draft.points.at(-1).y = y; });
      updateSegment(prevSegment.id, draft => { draft.points.at(-1).y = y; });
      updateSegment(nextSegment.id, draft => { draft.points[0].y = y; });
    }

    if (selectedSegment.orientation !== orientation && orientation === orientationVertical) {
      const x = selectedSegment.location === 'left'
        ? Math.min(selectedSegment.points[0].x, selectedSegment.points.at(-1).x)
        : Math.max(selectedSegment.points[0].x, selectedSegment.points.at(-1).x);
      updateSegment(selectedSegmentId, draft => { draft.points[0].x = draft.points.at(-1).x = x; });
      updateSegment(prevSegment.id, draft => { draft.points.at(-1).x = x; });
      updateSegment(nextSegment.id, draft => { draft.points[0].x = x; });
    }

    updateSegment(selectedSegmentId, draft => {
      draft.orientation = draft.orientation === orientation ? null : orientation;
    });
  }

  const buttonClass = "px-3 py-1 rounded text-xs font-medium";
  const activeClass = " bg-blue-100 text-blue-700";
  const inactiveClass = " bg-gray-100 text-gray-600";
  const activeButtonClass = buttonClass + activeClass +  " border-blue-100 border-1"
  const inactiveButtonClass = buttonClass + inactiveClass + " border-gray-100 border-1"
  const inactiveButtonHoverClass = buttonClass + inactiveClass + " border-blue-700 border-1 hover:bg-blue-100"

  const lineButtonClass = selectedSegment
    ? isLine
      ? activeButtonClass
      : inactiveButtonHoverClass
    : inactiveButtonClass;
  const nonLineButtonClass = (isType) =>
    selectedSegment
    ? isType
      ? activeButtonClass
      : isTopOrBottomLine(selectedSegmentId)
        ? inactiveButtonClass
        : inactiveButtonHoverClass
    : inactiveButtonClass;

  return (
    <>
      <div className="flex flex-row gap-2 border-l border-r px-2">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleTypeClick('line')}
            className={lineButtonClass}
          >Line</button>
          <button
            onClick={() => handleTypeClick('bezier')}
            className={nonLineButtonClass(isBezier)}
          >Bezier</button>
          {false && <button
            onClick={() => handleTypeClick('tension')}
            className={nonLineButtonClass(isTension)}
          >Tension</button>}
        </div>
        <div className="flex flex-col gap-2 w-20">
          {!selectedSegment &&
            <>
              <span className="text-center px-3 py-1 text-xs font-medium uppercase text-gray-500">Select</span>
              {/* <span className="text-center px-3 py-1 text-xs font-medium uppercase text-gray-500">A</span> */}
              <span className="text-center px-3 py-1 text-xs font-medium uppercase text-gray-500">Segment</span>
            </>
          }
          {canSplit && <button
            onClick={handleSplitClick}
            className={activeButtonClass}
          >Split</button>}
          {canDelete && <button
            onClick={handleDeleteClick}
            className={activeButtonClass}
          >Delete</button>}
          {isTension && <input
            type="number"
            min="0"
            max="100"
            value={100 * selectedSegment.tension}
            onChange={handleTensionChange}
            step="10"
            className={activeButtonClass}
          />}
        </div>
        <div className="flex flex-col gap-4 w-22 mt-1">
          { selectedSegment &&
            <div className="flex flex-row items-center gap-1">
              <div className="flex flex-row gap-1">
                <input
                  type="checkbox"
                  checked={selectedSegment.orientation === orientationHorizontal}
                  onChange={e => toggleOrientation(orientationHorizontal)}
                  className="border border-slate-300 rounded px-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <label className="text-[11px] text-slate-500 flex items-center gap-1">
                <FoldVertical size={12} />Horizontal
              </label>
            </div>
          }
          { selectedSegment &&
            <div className="flex flex-row items-center gap-1">
              <div className="flex flex-row gap-1">
                <input
                  type="checkbox"
                  checked={selectedSegment.orientation === orientationVertical}
                  onChange={e => toggleOrientation(orientationVertical)}
                  className="border border-slate-300 rounded px-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <label className="text-[11px] text-slate-500 flex items-center gap-1">
                <FoldHorizontal size={12} />Vertical
              </label>
            </div>
          }
        </div>
      </div>
    </>
  );
};
