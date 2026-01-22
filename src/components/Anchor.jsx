import { useApp } from '../AppProvider';
import { Circle } from 'react-konva';
import { produce } from 'immer'
import { getNearestSegments } from '../utilities/getNearestSegments';
import { isTopOrBottomLine, getTopLineY, getBottomLineY } from '../utilities/topBottom';
import { getAnchors, getAnchorEqualityFunction } from '../utilities/getAnchors';

export const Anchor = ({ anchor }) => {
  const { segments, setSegments, sceneSize } = useApp();

  const handleDragMove = (anchor, e) => {
    let minX = 10;
    let minY = 10;
    let maxX = sceneSize.width - 11;
    let maxY = sceneSize.height - 11;

    if (anchor.isEndPoint) {
      const allAnchors = getAnchors(segments).filter(anchor => anchor.isEndPoint);
      const sortedAnchors = { left: {}, right: {} };
      for (const [location, value] of Object.entries(sortedAnchors)) {
        const locationAnchors = allAnchors
          .filter(anchor => anchor.location === location)
          .sort((a, b) => a.locationOrder - b.locationOrder);
        value['anchors'] = locationAnchors;
        value['index'] = locationAnchors.findIndex(getAnchorEqualityFunction(anchor.startSegmentId, anchor.pointIndex));
      }

      if (anchor.isOnTopOrBottomLine) {
        if (anchor.point.y === sortedAnchors['left'].anchors[0].point.y) {
          maxY = Math.min(maxY, sortedAnchors['left'].anchors[1].point.y - 10);
          maxY = Math.min(maxY, sortedAnchors['right'].anchors[1].point.y - 10);

          if (anchor.location === 'left') {
            maxX = Math.min(maxX, sortedAnchors['right'].anchors[0].point.x - 10);
          }
          else {
            minX = Math.max(minX, sortedAnchors['left'].anchors[0].point.x + 10);
          }
        }
        else {
          minY = Math.max(minY, sortedAnchors['left'].anchors.at(-2).point.y + 10);
          minY = Math.max(minY, sortedAnchors['right'].anchors.at(-2).point.y + 10);

          if (anchor.location === 'left') {
            maxX = Math.min(maxX, sortedAnchors['right'].anchors.at(-1).point.x - 10);
          }
          else {
            minX = Math.max(minX, sortedAnchors['left'].anchors.at(-1).point.x + 10);
          }
        }
      }
      else {
        const anchors = sortedAnchors[anchor.location].anchors;
        const index = sortedAnchors[anchor.location].index;
        minY = Math.max(minY, 10 + getTopLineY(segments), anchors[index - 1].point.y);
        maxY = Math.min(maxY, getBottomLineY(segments) - 10, anchors[index + 1].point.y);
      }
    }

    const newPosition = e.target.position();
    newPosition.x = Math.min(Math.max(newPosition.x, minX), maxX);
    newPosition.y = Math.min(Math.max(newPosition.y, minY), maxY);
    e.target.position(newPosition);

    const pointIndex = anchor.pointIndex;
    setSegments(
      produce(segments, draft => {
        const { segment, nextSegment, prevSegment, prevPrevSegment } = getNearestSegments(draft, anchor.startSegmentId);

        segment.points[pointIndex] = newPosition;
        if (pointIndex === 0) {
          prevSegment.points = prevSegment.points.with(-1, newPosition);
        }
        if (isTopOrBottomLine(segment)) {
          segment.points[1].y = nextSegment.points[0].y = newPosition.y;
        }
        if (isTopOrBottomLine(prevSegment) && pointIndex === 0) {
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
      onDragMove={(e) => handleDragMove(anchor, e)}
    />
  );
};
