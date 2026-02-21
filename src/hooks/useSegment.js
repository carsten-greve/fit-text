import { useApp } from '../AppProvider';

export const useSegment = (id) => {
  const { _segments } = useApp();

  const segment = _segments.byId[id];

  const getNext = () => _segments.byId[segment?.nextSegmentId];
  const getPrev = () => _segments.byId[segment?.prevSegmentId];

  return {
    segment,
    nextSegment: getNext(),
    prevSegment: getPrev(),
    exists: !!segment
  };
};
