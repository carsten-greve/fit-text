import { useState } from 'react';
import { useApp } from '../AppProvider';
import { Line } from 'react-konva';

export const Segment = ({ segment }) => {
  const { selectedSegmentId, setSelectedSegmentId } = useApp();
  const [isHovered, setIsHover] = useState(false);

  return (
    <Line
      stroke="black"
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
