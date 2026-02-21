export const topLineId = '1';
export const bottomLineId = '3';

export const getSegments = _segments => _segments.allIds.map(id => _segments.byId[id]);

export const isTopOrBottomLine = id => [topLineId, bottomLineId].includes(id);
