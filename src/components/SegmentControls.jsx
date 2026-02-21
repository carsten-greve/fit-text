import { useApp } from '../AppProvider';
import { isTopOrBottomLine } from '../utilities/segmentUtils';
import { useSegment } from '../hooks/useSegment';

const getQuotientPoint = (p1, p2, dividend, divisor) => {
  return {
    x: ((divisor - dividend) * p1.x + dividend * p2.x) / divisor,
    y: ((divisor - dividend) * p1.y + dividend * p2.y) / divisor,
  }
}

export const SegmentControls = () => {
  const { selectedSegmentId, addSegmentAfter, removeSegment, updateSegment } = useApp();

  const { segment: selectedSegment, nextSegment, prevSegment } = useSegment(selectedSegmentId);

  const isLine = selectedSegment && selectedSegment.type === 'line';
  const isBezier = selectedSegment && selectedSegment.type === 'bezier';
  const isTension = selectedSegment && selectedSegment.type === 'tension';
  const canDelete =
    selectedSegment &&
    !isTopOrBottomLine(selectedSegment) &&
    !(isTopOrBottomLine(prevSegment) && isTopOrBottomLine(nextSegment));
  const canSplit = selectedSegment && !isTopOrBottomLine(selectedSegment);

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
          isTopOrBottomLine(draft)) {
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
    if (isTopOrBottomLine(nextSegment)) {
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
      : isTopOrBottomLine(selectedSegment)
        ? inactiveButtonClass
        : inactiveButtonHoverClass
    : inactiveButtonClass;

    return (
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
    </div>
  );
};
