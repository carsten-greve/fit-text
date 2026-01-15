export const getNearestSegments = (segments, segmentId) => {
  const segmentIndex = segments.findIndex(segment => segment.id === segmentId);
  const segment = segments[segmentIndex];
  const nextSegment = segments[(segmentIndex + 1) % segments.length];
  const prevSegment = segments.at(segmentIndex - 1);
  const prevPrevSegment = segments.at(segmentIndex - 2);

  return { segmentIndex, segment, nextSegment, prevSegment, prevPrevSegment };
}
