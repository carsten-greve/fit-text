import { useApp } from '../AppProvider';
import { produce } from 'immer'

export const getNearestSegments = (segments, segmentId) => {
  const segmentIndex = segments.findIndex(segment => segment.id === segmentId);
  const segment = segments[segmentIndex];
  const nextSegment = segments[(segmentIndex + 1) % segments.length];
  const prevSegment = segments.at(segmentIndex - 1);

  return { segmentIndex, segment, nextSegment, prevSegment };
}

const getQuotientPoint = (p1, p2, dividend, divisor) => {
  return {
    x: ((divisor - dividend) * p1.x + dividend * p2.x) / divisor,
    y: ((divisor - dividend) * p1.y + dividend * p2.y) / divisor,
  }
}

export const SegmentControls = () => {
  const { selectedSegmentId, segments, setSegments, nextSegmentId, setNextSegmentId } = useApp();

  const isTopOrBottomLine = (segment) => [1, 3].includes(segment.id);

  const { segment: selectedSegment, nextSegment, prevSegment } = getNearestSegments(segments, selectedSegmentId);
  const isLine = selectedSegment && selectedSegment.type === 'line';
  const isBezier = selectedSegment && selectedSegment.type === 'bezier';
  const isTension = selectedSegment && selectedSegment.type === 'tension';
  const canDelete =
    selectedSegment &&
    !isTopOrBottomLine(selectedSegment) &&
    !(isTopOrBottomLine(prevSegment) && isTopOrBottomLine(nextSegment));
  const canSplit = selectedSegment && !isTopOrBottomLine(selectedSegment);

  const handleTensionChange = (e) => {
    setSegments(
      produce(segments, draft => {
        const { segment: selectedSegment } = getNearestSegments(draft, selectedSegmentId);
        if (!selectedSegment) return;

        const newTension = parseFloat(e.target.value);
        selectedSegment.tension = (isNaN(newTension) ? 50 : newTension) / 100;
      }
    ));
  }

  const handleSplitClick = () => {
    setSegments(
      produce(segments, draft => {
        const { segmentIndex: selectedSegmentIndex, segment: selectedSegment } = getNearestSegments(draft, selectedSegmentId);
        if (!selectedSegment) return;

        const pStart = selectedSegment.points.at(0);
        const pEnd = selectedSegment.points.at(-1);

        const newSegment = {
          id: nextSegmentId,
          type: selectedSegment.type,
          location: selectedSegment.location,
        }

        switch (selectedSegment.type) {
          case 'line': {
            const pMid = getQuotientPoint(pStart, pEnd, 1, 2);
            newSegment.points = [pMid, pEnd];
            selectedSegment.points[1] = pMid;
            break;
          }

          case 'tension': {
            newSegment.tension = selectedSegment.tension;
            const pMid = getQuotientPoint(pStart, pEnd, 1, 2);
            newSegment.points = [pMid, getQuotientPoint(pMid, pEnd, 1, 2), pEnd];
            selectedSegment.points = [pStart, getQuotientPoint(pStart, pMid, 1, 2), pMid];
            break;
          }

          case 'bezier': {
            const pMid = getQuotientPoint(pStart, pEnd, 1, 2);
            newSegment.points = [pMid, getQuotientPoint(pMid, pEnd, 1, 3), getQuotientPoint(pMid, pEnd, 2, 3), pEnd];
            selectedSegment.points = [pStart, getQuotientPoint(pStart, pMid, 1, 3), getQuotientPoint(pStart, pMid, 2, 3), pMid];
            break;
          }

          default:
            return;
        }

        draft.splice(selectedSegmentIndex + 1, 0, newSegment);
      }
    ));

    setNextSegmentId(1 + nextSegmentId);
  }

  const handleTypeClick = (newSegmentType) => {
    setSegments(
      produce(segments, draft => {
        const { segment: selectedSegment } = getNearestSegments(draft, selectedSegmentId);
        if (!selectedSegment ||
            selectedSegment.type === newSegmentType ||
            isTopOrBottomLine(selectedSegment)) {
          return;
        }

        const pStart = selectedSegment.points.at(0);
        const pEnd = selectedSegment.points.at(-1);
        selectedSegment.type = newSegmentType;

        switch (newSegmentType) {
          case 'line': {
            selectedSegment.points = [pStart, pEnd];
            break;
          }

          case 'tension': {
            selectedSegment.tension ??= 0.5;
            selectedSegment.points = [pStart, getQuotientPoint(pStart, pEnd, 1, 2), pEnd];
            break;
          }

          case 'bezier': {
            selectedSegment.points = [pStart, getQuotientPoint(pStart, pEnd, 1, 3), getQuotientPoint(pStart, pEnd, 2, 3), pEnd];
            break;
          }

          default:
            return;
        }
      }
    ));
  }

  const handleDeleteClick = () => {
    setSegments(
      produce(segments, draft => {
        const { segmentIndex: selectedSegmentIndex, nextSegment, prevSegment } = getNearestSegments(draft, selectedSegmentId);

        if (isTopOrBottomLine(nextSegment)) {
          prevSegment.points.splice(-1, 1, nextSegment.points[0]);
        }
        else {
          nextSegment.points.splice(0, 1, prevSegment.points.at(-1));
        }
        draft.splice(selectedSegmentIndex, 1);
      }
    ));
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
    <div className="flex flex-row gap-3 border-l pl-4">
      <div className="flex flex-col gap-2">
        <button
          onClick={() => handleTypeClick('line')}
          className={lineButtonClass}
        >Line</button>
        <button
          onClick={() => handleTypeClick('bezier')}
          className={nonLineButtonClass(isBezier)}
        >Bezier</button>
        <button
          onClick={() => handleTypeClick('tension')}
          className={nonLineButtonClass(isTension)}
        >Tension</button>
      </div>
      <div className="flex flex-col gap-2 w-20">
        {!selectedSegment &&
          <>
            <span className="text-center px-3 py-1 text-xs font-medium uppercase text-gray-500">Select</span>
            <span className="text-center px-3 py-1 text-xs font-medium uppercase text-gray-500">A</span>
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
