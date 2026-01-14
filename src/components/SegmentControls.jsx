import { useApp } from '../AppProvider';
import { produce } from 'immer'

const getNearestSegments = (segments, segmentId) => {
  const selectedSegmentIndex = segments.findIndex(segment => segment.id === segmentId);
  const selectedSegment = segments[selectedSegmentIndex];
  const nextSegment = segments[(selectedSegmentIndex + 1) % segments.length];
  const prevSegment = segments[(segments.length + selectedSegmentIndex - 1) % segments.length];

  return { selectedSegmentIndex, selectedSegment, nextSegment, prevSegment };
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

  const { selectedSegment, nextSegment, prevSegment } = getNearestSegments(segments, selectedSegmentId);
  const isLine = selectedSegment && selectedSegment.type === 'line';
  const isBezier = selectedSegment && selectedSegment.type === 'bezier';
  const isTension = selectedSegment && selectedSegment.type === 'tension';
  const canDelete =
    selectedSegment &&
    !isTopOrBottomLine(selectedSegment) &&
    !(isTopOrBottomLine(prevSegment) && isTopOrBottomLine(nextSegment));
  const canSplit = selectedSegment && !isTopOrBottomLine(selectedSegment);

  const classNameButton = "px-3 py-1 rounded text-xs font-medium";
  const classNameActive = classNameButton + " bg-blue-100 text-blue-700";
  const classNameInActive = classNameButton + " bg-gray-100 text-gray-600";

  const handleTensionChange = (e) => {
    setSegments(
      produce(segments, draft => {
        const { selectedSegment } = getNearestSegments(draft, selectedSegmentId);
        if (!selectedSegment) return;

        const newTension = parseFloat(e.target.value);
        selectedSegment.tension = (isNaN(newTension) ? 50 : newTension) / 100;
      }
    ));
  }

  const handleSplitClick = () => {
    setSegments(
      produce(segments, draft => {
        const { selectedSegmentIndex, selectedSegment, nextSegment, prevSegment } = getNearestSegments(draft, selectedSegmentId);
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

          case 'tension':
            break;

            case 'line':
            break;

          default:
            return;
        }

        draft.splice(selectedSegmentIndex + 1, 0, newSegment);
      }
    ));

    setNextSegmentId(1 + nextSegmentId);
  }

  return (
    <div className="flex flex-row gap-3 border-l pl-4">
      <div className="flex flex-col gap-2">
        <button className={isLine ? classNameActive : classNameInActive}>Line</button>
        <button className={isBezier ? classNameActive : classNameInActive}>Bezier</button>
        <button className={isTension ? classNameActive : classNameInActive}>Tension</button>
      </div>
      <div className="flex flex-col gap-2 w-20">
        {!selectedSegment &&
          <>
            <span className="text-center px-3 py-1 text-xs font-medium uppercase text-gray-500">Select</span>
            <span className="text-center px-3 py-1 text-xs font-medium uppercase text-gray-500">A</span>
            <span className="text-center px-3 py-1 text-xs font-medium uppercase text-gray-500">Segment</span>
          </>
        }
        {canDelete && <button className={classNameActive}>Delete</button>}
        {canSplit && <button
          onClick={handleSplitClick}
          className={classNameActive}
        >Split</button>}
        {isTension && <input
          type="number"
          min="0"
          max="100"
          value={100 * selectedSegment.tension}
          onChange={handleTensionChange}
          step="10"
          className={classNameActive}
        />}
      </div>
    </div>
  );
};
