export const topLineId = '1';
export const bottomLineId = '3';

export const orientationHorizontal = 'horizontal';
export const orientationVertical = 'vertical';

export const isHorizontal = segment => segment.orientation === orientationHorizontal;
export const isVertical = segment => segment.orientation === orientationVertical;

export const getSegments = _segments => _segments.allIds.map(id => _segments.byId[id]);

export const isTopOrBottomLine = id => [topLineId, bottomLineId].includes(id);
