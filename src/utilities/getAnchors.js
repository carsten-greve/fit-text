import { isTopLine, isTopOrBottomLine } from '../utilities/topBottom';

export const getAnchors = segments => {
  let prevSegment = segments.at(-1);

  return segments.flatMap(segment => {
    const newAnchorsInSegment = [{
      startSegmentId: segment.id,
      point: segment.points[0],
      pointIndex: 0,
      types: [prevSegment.type, segment.type],
      isOnTopOrBottomLine: isTopOrBottomLine(prevSegment) || isTopOrBottomLine(segment),
      isEndPoint: true,
      location: isTopOrBottomLine(segment) ? (isTopLine(segment) ? 'left' : 'right') : segment.location,
    }].concat(segment.points.slice(1, -1).map((point, pointIndex) => {
      return {
        startSegmentId: segment.id,
        point,
        pointIndex: 1 + pointIndex,
        types: [segment.type],
        isOnTopOrBottomLine: false,
        isEndPoint: false,
        location: segment.location,
      }
    }));
    prevSegment = segment;

    return newAnchorsInSegment;
  });
};

export const getAnchorEqualityFunction = (startSegmentId, pointIndex) => {
  return anchor => anchor.startSegmentId === startSegmentId && anchor.pointIndex === pointIndex;
}
