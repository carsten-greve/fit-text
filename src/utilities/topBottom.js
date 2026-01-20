export const isTopLine = (segment) => segment.id === 1;
export const isBottomLine = (segment) => segment.id === 3;
export const isTopOrBottomLine = (segment) => [1, 3].includes(segment.id);

export const getTopLineSegment = (segments) => segments.find(segment => segment.location === 'top');
export const getBottomLineSegment = (segments) => segments.find(segment => segment.location === 'bottom');

export const getTopLineY = (segments) => getTopLineSegment(segments).points[0].y;
export const getBottomLineY = (segments) => getBottomLineSegment(segments).points[0].y;
