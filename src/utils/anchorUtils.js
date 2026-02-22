import { topLineId, bottomLineId } from "./segmentUtils";

export const isTopLeft = (anchor) => anchor.nextSegmentId === topLineId;
export const isTopRight = (anchor) => anchor.prevSegmentId === topLineId;
export const isBottomRight = (anchor) => anchor.nextSegmentId === bottomLineId;
export const isBottomLeft = (anchor) => anchor.prevSegmentId === bottomLineId;
export const isOnTopLine = (anchor) => isTopLeft(anchor) || isTopRight(anchor);
export const isOnBottomLine = (anchor) => isBottomLeft(anchor) || isBottomRight(anchor);
export const isOnTopOrBottomLine = (anchor) => isOnTopLine(anchor) || isOnBottomLine(anchor);

export const getAnchors = segments => {
  const segmentEndpointAnchors = segments.reduce((acc, key) => ({ ...acc, [key.id]: [] }), {});
  let prevSegment = segments.at(-1);

  const anchors = segments.flatMap(segment => {
    const newAnchorsInSegment = [{
      prevSegmentId: segment.prevSegmentId,
      nextSegmentId: segment.id,
      point: segment.points[0],
      pointIndex: 0,
      isEndPoint: true,
    }].concat(segment.points.slice(1, -1).map((point, index) => {
      return {
        prevSegmentId: segment.prevSegmentId,
        nextSegmentId: segment.id,
        point,
        pointIndex: 1 + index,
        isEndPoint: false,
      }
    }));
    prevSegment = segment;

    segmentEndpointAnchors[newAnchorsInSegment[0].prevSegmentId].push(newAnchorsInSegment[0]);
    segmentEndpointAnchors[newAnchorsInSegment[0].nextSegmentId].push(newAnchorsInSegment[0]);

    return newAnchorsInSegment;
  });

  return { anchors, segmentEndpointAnchors };
};

export const getBoundaryAnchors = endPointAnchors => {
  let topLeft = null, topRight = null, bottomRight = null, bottomLeft = null, topMiddle = null, bottomMiddle = null;

  for (const anchor of endPointAnchors) {
    if (isTopLeft(anchor)) topLeft = anchor;
    else if (isTopRight(anchor)) topRight = anchor;
    else if (isBottomRight(anchor)) bottomRight = anchor;
    else if (isBottomLeft(anchor)) bottomLeft = anchor;
    else {
      if (
        (isTopLeft(anchor.nextEndPointAnchor) || isTopRight(anchor.prevEndPointAnchor)) &&
        (!topMiddle || topMiddle.point.y > anchor.point.y)
      ) topMiddle = anchor;
      if (
        (isBottomLeft(anchor.prevEndPointAnchor) || isBottomRight(anchor.nextEndPointAnchor)) &&
        (!bottomMiddle || bottomMiddle.point.y < anchor.point.y)
      ) bottomMiddle = anchor;
    }
  }

  if (topMiddle === null) topMiddle = bottomLeft;
  if (bottomMiddle === null) bottomMiddle = topLeft;

  return { topLeft, topRight, bottomRight, bottomLeft, topMiddle, bottomMiddle };
};
