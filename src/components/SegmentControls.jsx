import { useApp } from '../AppProvider';
import { produce } from 'immer'

export const SegmentControls = () => {
  const { selectedSegmentId, segments, setSegments } = useApp();

  const isTopOrBottomLine = (segment) => [1, 3].includes(segment.id);

  const selectedSegmentIndex = segments.findIndex(segment => segment.id === selectedSegmentId);
  const selectedSegment = segments[selectedSegmentIndex];
  const nextSegment = segments[(selectedSegmentIndex + 1) % segments.length];
  const prevSegment = segments[(segments.length + selectedSegmentIndex - 1) % segments.length];
  const isLine = selectedSegment && selectedSegment.type === 'line';
  const isBezier = selectedSegment && selectedSegment.type === 'bezier';
  const isTension = selectedSegment && selectedSegment.type === 'tension';
  const canDelete =
    selectedSegment &&
    !isTopOrBottomLine(selectedSegment) &&
    !(isTopOrBottomLine(prevSegment) && isTopOrBottomLine(nextSegment));

  const classNameButton = "px-3 py-1 rounded text-xs font-medium";
  const classNameActive = classNameButton + " bg-blue-100 text-blue-700";
  const classNameInActive = classNameButton + " bg-gray-100 text-gray-600";

  const handleTensionChange = (e) => {
    setSegments(
      produce(segments, draft => {
        const selectedSegment = draft.find(segment => segment.id === selectedSegmentId);
        if (!selectedSegment) return;

        const newTension = parseFloat(e.target.value);
        selectedSegment.tension = (isNaN(newTension) ? 50 : newTension) / 100;
      }
    ));
  }

  return (
    <div className="flex flex-row gap-3 border-l pl-4">
      <div className="flex flex-col gap-2">
        <button className={isLine ? classNameActive : classNameInActive}>Line</button>
        <button className={isBezier ? classNameActive : classNameInActive}>Bezier</button>
        <button className={isTension ? classNameActive : classNameInActive}>Tension</button>
      </div>
      <div className="flex flex-col gap-2">
        <span className="px-3 py-1 text-xs font-medium uppercase text-gray-500">Select Segment</span>
        {canDelete && <button className={classNameActive}>Delete</button>}
        {isLine && <button className={classNameActive}>Split</button>}
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
