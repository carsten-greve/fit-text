import { binarySearch } from './binarySearch';
import { getPathData } from './getPathData';

export const getTextArea = (segments, sampleCount = 100) => {
  return {
    leftPoints: getPoints(segments, 'left', sampleCount).reverse(),
    rightPoints: getPoints(segments, 'right', sampleCount),

    getMinMax(y, height = 12) {
      return {
        leftX: Math.max(...[...Array(1 + Math.round(height)).keys()].map(i => getX(this.leftPoints, y + i - (height / 2)))),
        rightX: Math.min(...[...Array(1 + Math.round(height)).keys()].map(i => getX(this.rightPoints, y + i - (height / 2)))),
      };
    },
  };
}

const getPoints = (segments, location, sampleCount) => {
  const pathData = getPathData(segments.filter(segment => segment.location === location));
  const path = new Konva.Path({data: pathData});
  const length = path.getLength();

  return [...Array(1 + sampleCount).keys()].map(i => path.getPointAtLength(length * i / sampleCount));
}

const getX= (points, y) => {
  let x = 0;
  const bs = binarySearch(points, y, p1 => p1.y - y);
  if (bs < 0) {
    const index = -bs - 2;
    if (index < 0) {
      x = points[0].x;
    }
    else if (index > points.length - 2) {
      x = points.at(-1).x;
    }
    else {
      const p1 = points[index];
      const p2 = points[index + 1];
      x = p2.y === p1.y ? p1.x : p1.x + (y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y);
    }
  }
  else {
      x = points[bs].x;
  }

  return x;
}
