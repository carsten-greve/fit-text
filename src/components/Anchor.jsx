import { useApp } from '../AppProvider';
import { Circle } from 'react-konva';
import { produce } from 'immer'
import { getNearestSegments } from '../utilities/getNearestSegments';
import { isTopOrBottomLine } from '../utilities/topBottom';
import { getAnchors, getAnchorEqualityFuntion } from '../utilities/getAnchors';

export const Anchor = ({ anchor }) => {
  const { segments, setSegments, sceneSize } = useApp();

  const handleDragMove = (anchor, e) => {
    const newPosition = e.target.position();
    const { segmentIndex, segment, nextSegment, prevSegment } = getNearestSegments(segments, anchor.startSegmentId);
    const pointIndex = anchor.pointIndex;

    let minX = 10;
    let minY = 10;
    let maxX = sceneSize.width - 11;
    let maxY = sceneSize.height - 11;
    // let nonHorizontalAnchorMaxX

    const allAnchors = getAnchors(segments);
    const sortedAnchors = { left: {}, right: {} };
    for (const [location, value] of Object.entries(sortedAnchors)) {
      const locationAnchors = allAnchors.filter(anchor => anchor.location === location).sort((a, b) => a.point.y - b.point.y);
      value['anchors'] = locationAnchors;
      value['index'] = locationAnchors.findIndex(getAnchorEqualityFuntion(anchor.startSegmentId, anchor.pointIndex));
    }

    if (anchor.isOnTopOrBottomLine) {
      if (anchor.point.y === sortedAnchors['left'].anchors[0].point.y) {
        maxY = Math.min(maxY, sortedAnchors['left'].anchors[1].point.y - 10);
        maxY = Math.min(maxY, sortedAnchors['right'].anchors[1].point.y - 10);
      }
    }
    else {
      const anchors = sortedAnchors[anchor.location].anchors;
      const index = sortedAnchors[anchor.location].index;
      minY = Math.max(minY, 10 + anchors[index - 1].point.y);
      maxY = Math.min(maxY, anchors[index + 1].point.y - 10);
    }

    newPosition.x = Math.min(Math.max(newPosition.x, minX), maxX);
    newPosition.y = Math.min(Math.max(newPosition.y, minY), maxY);
    e.target.position(newPosition);

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
