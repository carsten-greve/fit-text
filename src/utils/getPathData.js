import { cardinalToCubicBezier } from './cardinalToCubicBezier';

export const getPathData = segments => segments.length === 0 ? '' : segments.reduce(
  (path, segment) => {
    switch (segment.type) {
      case 'line':
        return path + `L ${segment.points[1].x},${segment.points[1].y} `;

      case 'bezier':
        return path + `C ${segment.points[1].x},${segment.points[1].y} ${segment.points[2].x},${segment.points[2].y} ${segment.points[3].x},${segment.points[3].y} `;

      case 'tension':
        return path + cardinalToCubicBezier(segment.points, segment.tension, false);

      default:
        return '';
    }
  },
  `M ${segments[0].points[0].x},${segments[0].points[0].y} `,
);
