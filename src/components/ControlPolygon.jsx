import { Line } from 'react-konva';

export const ControlPolygon = ({ segment }) => {
  return (
    <Line
      stroke="black"
      strokeWidth={1}
      dash={[10, 10, 2, 10]}
      opacity={0.5}
      points={segment.points.flatMap(p => [p.x, p.y])}
    />
  );
};
