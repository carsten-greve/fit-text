export const isTopLine = (segment) => segment.id === 1;
export const isBottomLine = (segment) => segment.id === 3;
export const isTopOrBottomLine = (segment) => [1, 3].includes(segment.id);
