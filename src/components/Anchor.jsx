import { useApp } from '../AppProvider';
import { Circle } from 'react-konva';
import { produce } from 'immer'

export const Anchor = ({ anchor }) => {
  const { segments, setSegments, sceneSize } = useApp();

  const isTopOrBottomLine = (segment) => [1, 3].includes(segment.id);

  const handleDragMove = (anchor, newPosition) => {
    const segmentIndex = anchor.startSegmentIndex;
    const pointIndex = anchor.pointIndex;

    let minX = 10;
    let minY = 10;
    let maxX = sceneSize.width - 11;
    let maxY = sceneSize.height - 11;
    // let nonHorizontalAnchorMaxX

    newPosition.x = Math.min(Math.max(newPosition.x, minX), maxX);
    newPosition.y = Math.min(Math.max(newPosition.y, minY), maxY);

    console.log(`maxX: ${maxX}`);
    console.log(`maxY: ${maxY}`);

    console.log(`newPosition.x: ${newPosition.x}`);
    console.log(`newPosition.y: ${newPosition.y}`);

    setSegments(
      produce(segments, draft => {
        const nextSegment = draft[segmentIndex];
        const prevSegment = draft.at(segmentIndex - 1);

        nextSegment.points[pointIndex] = newPosition;
        if (pointIndex === 0) {
          prevSegment.points = prevSegment.points.with(-1, newPosition);
        }
        if (isTopOrBottomLine(nextSegment)) {
          const nextNextSegment = draft[(segmentIndex + 1) % draft.length];
          nextSegment.points[1].y = nextNextSegment.points[0].y = newPosition.y;
        }
        if (isTopOrBottomLine(prevSegment) && pointIndex === 0) {
          const prevPrevSegment = draft.at(segmentIndex - 2);
          prevSegment.points[0].y = prevPrevSegment.points.at(-1).y = newPosition.y;
        }
      }
    ));
  };

  return (
    <Circle
      position={anchor.point}
      radius={6}
      stroke={"blue"}
      strokeWidth={1}
      fill={anchor.isEndPoint ? "blue" : "white"}
      draggable
      onDragMove={(e) => handleDragMove(anchor, e.target.position())}
    />
  );
};
