import { useApp } from '../AppProvider';
import { Stage, Layer, Circle, Line, Text } from 'react-konva';
import {produce} from 'immer'

const FitArea = () => {
  const { stageSize, sceneSize, konvaRef, segments, setSegments } = useApp();

  const handleAnchorDrag = (segmentIndex, pointIndex, newPos) => {
    setSegments(
      produce(segments, draft => {
        draft[segmentIndex].points[pointIndex] = newPos;
        if (pointIndex === 0) {
          const nextSegmentPoints = draft[(segments.length + segmentIndex - 1) % segments.length].points;
          nextSegmentPoints[nextSegmentPoints.length - 1] = newPos;
        }
      }
    ));
  };

  return (
    <>
      <main className="relative flex-1 w-full bg-gray-100 overflow-hidden">
        {/* Faded Background Image Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30 bg-center bg-no-repeat bg-contain"
          // style={{ backgroundImage: `url(${uploadedImageUrl})` }}
        />
        
        <div className="absolute inset-0" ref={konvaRef}>
          <Stage width={stageSize.width} height={stageSize.height} scaleX={stageSize.scale} scaleY={stageSize.scale}>
            <Layer>
              <Text text={`sceneSize.width: ${sceneSize.width}`} x={0} y={0}></Text>
              <Text text={`stageSize.width: ${stageSize.width}`} x={0} y={20}></Text>
              <Text text={`stageSize.scale: ${stageSize.scale}`} x={0} y={40}></Text>
              {/* Render the actual path */}
              {segments.map((seg) => (
                <Line
                  key={seg.id}
                  stroke="black"
                  strokeWidth={2}
                  points={seg.points.flatMap(p => [p.x, p.y])}
                  bezier={seg.type === 'bezier'}
                  tension={seg.type === 'tension' ? seg.tension : 0}
                />
              ))}

              {/* Render draggable anchor points for every point in every segment */}
              {segments.map((segment, segmentIndex) => 
                segment.points.map((point, pointIndex) => {
                  if (pointIndex > segment.points.length - 2) { // Except the last point (the first point of the next segment)
                    return null;
                  }

                  return (
                    <Circle
                      key={`${segment.id}-${pointIndex}`}
                      x={point.x}
                      y={point.y}
                      radius={6}
                      fill="blue"
                      draggable
                      onDragMove={(e) => handleAnchorDrag(segmentIndex, pointIndex, e.target.position())}
                    />
                  );
                })
              )}
            </Layer>
          </Stage>
        </div>
      </main>
    </>
  );
}

export default FitArea
