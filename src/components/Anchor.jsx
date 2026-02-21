import { useApp } from '../AppProvider';
import { Circle } from 'react-konva';
import { getNearestSegments } from '../utilities/segmentUtils';
import { isTopOrBottomLine } from '../utilities/segmentUtils';
import {
  isTopLeft,
  isTopRight,
  isBottomRight,
  isBottomLeft,
  isOnTopOrBottomLine,
  getBoundaryAnchors
} from '../utilities/anchorUtils';

export const Anchor = ({ anchor }) => {
  const { segments, updateSegment, endPointAnchors, sceneSize } = useApp();

  const handleDragMove = (anchor, e) => {
    let minX = 10;
    let minY = 10;
    let maxX = sceneSize.width - 11;
    let maxY = sceneSize.height - 11;

    if (anchor.isEndPoint) {
      const { topLeft, topRight, bottomRight, bottomLeft, topMiddle, bottomMiddle } = getBoundaryAnchors(endPointAnchors);

      if (isOnTopOrBottomLine(anchor)) {
        if (isTopLeft(anchor)) {
          maxX = Math.min(maxX, topRight.point.x - 10);
          maxY = Math.min(maxY, topMiddle.point.y - 10);
        }
        else if (isTopRight(anchor)) {
          minX = Math.max(minX, topLeft.point.x + 10);
          maxY = Math.min(maxY, topMiddle.point.y - 10);
        }
        else if (isBottomRight(anchor)) {
          minX = Math.max(minX, bottomLeft.point.x + 10);
          minY = Math.max(minY, bottomMiddle.point.y + 10);
        }
        else if (isBottomLeft(anchor)) {
          maxX = Math.min(maxX, bottomRight.point.x - 10);
          minY = Math.max(minY, bottomMiddle.point.y + 10);
        }
      }
      else {
        minY = Math.max(
          minY,
          topLeft.point.y + 10,
          Math.min(anchor.prevEndPointAnchor.point.y, anchor.nextEndPointAnchor.point.y)
        );
        maxY = Math.min(
          maxY,
          bottomLeft.point.y - 10,
          Math.max(anchor.prevEndPointAnchor.point.y, anchor.nextEndPointAnchor.point.y)
        );
      }
    }

    const newPosition = e.target.position();
    newPosition.x = Math.min(Math.max(newPosition.x, minX), maxX);
    newPosition.y = Math.min(Math.max(newPosition.y, minY), maxY);
    e.target.position(newPosition);

    const pointIndex = anchor.pointIndex;
    const { segment, nextSegment, prevSegment, prevPrevSegment } = getNearestSegments(segments, anchor.nextSegmentId);

    updateSegment(segment.id, draft => { draft.points[pointIndex] = newPosition });
    if (pointIndex === 0) {
      updateSegment(prevSegment.id, draft => { draft.points = draft.points.with(-1, newPosition) });
    }
    if (isTopOrBottomLine(segment)) {
      updateSegment(segment.id, draft => { draft.points[1].y = newPosition.y });
      updateSegment(nextSegment.id, draft => { draft.points[0].y = newPosition.y });
    }
    if (isTopOrBottomLine(prevSegment) && pointIndex === 0) {
      updateSegment(prevSegment.id, draft => { draft.points[0].y = newPosition.y });
      updateSegment(prevPrevSegment.id, draft => { draft.points.at(-1).y = newPosition.y });
    }
  };

  return (
    <Circle
      position={anchor.point}
      radius={6}
      stroke={"blue"}
      strokeWidth={1}
      fill={anchor.isEndPoint ? "blue" : "white"}
      draggable
      onDragMove={(e) => handleDragMove(anchor, e)}
    />
  );
};
