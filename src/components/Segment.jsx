import { useState } from 'react';
import { useApp } from '../AppProvider';
import { Line } from 'react-konva';

export const Segment = ({ segment }) => {
  const { selectedSegmentId, setSelectedSegmentId } = useApp();
  const [isHovered, setIsHover] = useState(false);

  const lineColor = ["top", "bottom"].includes(segment.location)
    ? "green"
    : ["horizontal", "vertical"].includes(segment.orientation)
      ? "darkorange"
      : "black";

      return (
    <Line
      stroke={lineColor}
      strokeWidth={selectedSegmentId === segment.id ? 4 : 2}
      points={segment.points.flatMap(p => [p.x, p.y])}
      bezier={segment.type === 'bezier'}
      tension={segment.type === 'tension' ? segment.tension : 0}
      hitStrokeWidth={25}
      shadowColor='black'
      shadowBlur={10}
      shadowOpacity={0.5}
      shadowEnabled={isHovered}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={(e) => {
         setSelectedSegmentId(segment.id);
         e.cancelBubble = true;
      }}
    />
  );
};
