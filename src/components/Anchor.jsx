import { useApp } from '../AppProvider';
import { Circle } from 'react-konva';
import { isHorizontal, isVertical } from '../utils/segmentUtils';
import {
  isTopLeft,
  isTopRight,
  isBottomRight,
  isBottomLeft,
  isOnTopOrBottomLine,
  getBoundaryAnchors
} from '../utils/anchorUtils';

export const Anchor = ({ anchor }) => {
  const { _segments, updateSegment, endPointAnchors, sceneSize } = useApp();

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
        let prev = anchor.prevEndPointAnchor;
        while (isHorizontal(_segments.byId[prev.nextSegmentId])) prev = prev.prevEndPointAnchor;
        let next = anchor.nextEndPointAnchor;
        while (isHorizontal(_segments.byId[next.prevSegmentId])) next = next.nextEndPointAnchor;

        minY = Math.max(minY, topLeft.point.y + 10, Math.min(prev.point.y, next.point.y));
        maxY = Math.min(maxY, bottomLeft.point.y - 10, Math.max(prev.point.y, next.point.y));
      }

      let prev = anchor;
      while (isVertical(_segments.byId[prev.prevSegmentId])) prev = prev.prevEndPointAnchor;
      if (isTopRight(prev)) {
        minX = Math.max(minX, topLeft.point.x + 10);
      }
      else if (isBottomLeft(prev)) {
        maxX = Math.min(maxX, bottomRight.point.x - 10);
      }

      let next = anchor;
      while (isVertical(_segments.byId[next.nextSegmentId])) next = next.nextEndPointAnchor;
      if (isTopLeft(next)) {
        maxX = Math.min(maxX, topRight.point.x - 10);
      }
      else if (isBottomRight(next)) {
        minX = Math.max(minX, bottomLeft.point.x + 10);
      }
    }

    const newPosition = e.target.position();
    newPosition.x = Math.min(Math.max(newPosition.x, minX), maxX);
    newPosition.y = Math.min(Math.max(newPosition.y, minY), maxY);
    e.target.position(newPosition);

    updateSegment(anchor.nextSegmentId, draft => { draft.points[anchor.pointIndex] = newPosition });
    if (anchor.isEndPoint) {
      updateSegment(anchor.prevSegmentId, draft => { draft.points = draft.points.with(-1, newPosition) });

      ['x', 'y'].forEach(xy => {
        let segment = _segments.byId[anchor.nextSegmentId];
        while ((xy === 'y' && isHorizontal(segment)) || (xy === 'x' && isVertical(segment))) {
          updateSegment(segment.id, draft => { draft.points.at(-1)[xy] = newPosition[xy] });
          updateSegment(segment.nextSegmentId, draft => { draft.points[0][xy] = newPosition[xy] });
          segment = _segments.byId[segment.nextSegmentId];
        }

        segment = _segments.byId[anchor.prevSegmentId];
        while ((xy === 'y' && isHorizontal(segment)) || (xy === 'x' && isVertical(segment))) {
          updateSegment(segment.id, draft => { draft.points[0][xy] = newPosition[xy] });
          updateSegment(segment.prevSegmentId, draft => { draft.points.at(-1)[xy] = newPosition[xy] });
          segment = _segments.byId[segment.prevSegmentId];
        }
      });
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
