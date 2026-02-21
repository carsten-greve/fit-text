export const isTopLeft = (anchor) => anchor.nextSegmentId === '1';
export const isTopRight = (anchor) => anchor.prevSegmentId === '1';
export const isBottomRight = (anchor) => anchor.nextSegmentId === '3';
export const isBottomLeft = (anchor) => anchor.prevSegmentId === '3';
export const isOnTopLine = (anchor) => isTopLeft(anchor) || isTopRight(anchor);
export const isOnBottomLine = (anchor) => isBottomLeft(anchor) || isBottomRight(anchor);
export const isOnTopOrBottomLine = (anchor) => isOnTopLine(anchor) || isOnBottomLine(anchor);

export const getAnchors = segments => {
  let prevSegment = segments.at(-1);

  return segments.flatMap(segment => {
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

    return newAnchorsInSegment;
  });
};

export const getBoundaryAnchors = endPointAnchors => {
  let topLeft = null, topRight = null, bottomRight = null, bottomLeft = null, topMiddle = null, bottomMiddle = null;

  for (const anchor of endPointAnchors) {
    if (isTopLeft(anchor)) topLeft = anchor;
    else if (isTopRight(anchor)) topRight = anchor;
    else if (isBottomRight(anchor)) bottomRight = anchor;
    else if (isBottomLeft(anchor)) bottomLeft = anchor;
    else if (
      (isTopLeft(anchor.nextEndPointAnchor) || isTopRight(anchor.prevEndPointAnchor)) &&
      (!topMiddle || topMiddle.point.y > anchor.point.y)
    ) topMiddle = anchor;
    else if (
      (isBottomLeft(anchor.prevEndPointAnchor) || isBottomRight(anchor.nextEndPointAnchor)) &&
      (!bottomMiddle || bottomMiddle.point.y < anchor.point.y)
    ) bottomMiddle = anchor;
  }

  if (topMiddle === null) topMiddle = bottomLeft;
  if (bottomMiddle === null) bottomMiddle = topLeft;

  return { topLeft, topRight, bottomRight, bottomLeft, topMiddle, bottomMiddle };
};
