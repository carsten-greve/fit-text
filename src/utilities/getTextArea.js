import { binarySearch } from './binarySearch';
import { getPathData } from './getPathData';


export const getTextArea = (segments, sampleCount = 100) => {
  return {
    leftPoints: getPoints(segments, 'left', sampleCount),
    rightPoints: getPoints(segments, 'right', sampleCount),

    getMinMax(y) {
      return {
        leftX: getX(this.leftPoints, y),
        rightX: getX(this.rightPoints, y),
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
  let min = 0;
  const bs = binarySearch(points, y, (p1, p2) => p1.y - p2.y);
  if (bs < 0) {
    const index = -bs - 2;
    if (index < 0) {
      min = points[0].x;
    }
    else if (index > points.length - 2) {
      min = points.at(-1).x;
    }
    else {
      const p1 = points[index];
      const p2 = points[index + 1];
      min = p2.y === p1.y ? p1.x : p1.x + (y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y);
    }
  }
  else {
      min = points[bs].x;
  }
}
