import { useApp } from '../AppProvider';
import { getShapeBoundaries } from '../utilities/getShapeBoundaries';
import { Path } from 'react-konva';

export const ShapeBoundary = () => {
  const { segments, sampleCount } = useApp();

  const shapeBoundaries = getShapeBoundaries(segments, sampleCount);

  return (
    <>
      {shapeBoundaries.leftPoints.at(0) && <Path data={
        shapeBoundaries.leftPoints.reduce((path, point, i) => {
          return `${path} ${i === 0 ? "M" : "L"}${point.x},${point.y}`
        }, '')
      } dash={[10,10]} stroke={'cyan'} listening={false} />}

      {shapeBoundaries.rightPoints.at(0) && <Path data={
        shapeBoundaries.rightPoints.reduce((path, point, i) => {
          return `${path} ${i === 0 ? "M" : "L"}${point.x},${point.y}`
        }, '')
      } dash={[10,10]} stroke={'cyan'} listening={false} />}
    </>
  );
}
