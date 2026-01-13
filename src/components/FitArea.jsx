import { useApp } from '../AppProvider';
import { Stage, Layer, Circle, Line, Text } from 'react-konva';
import { produce } from 'immer'

const FitArea = () => {
  const { stageSize, sceneSize, konvaRef, segments, setSegments } = useApp();

  const isTopLine = (segment) => segment.id === 1;
  const isBottomLine = (segment) => segment.id === 3;
  const isTopOrBottomLine = (segment) => isTopLine(segment) || isBottomLine(segment);

  let anchors = produce(segments, draft => {
    let prevSegment = draft[draft.length - 1];

    return draft.flatMap((segment, segmentIndex) => {
      const newAnchorsInSegment = [{
        startSegmentId: segment.id,
        startSegmentIndex: segmentIndex,
        point: segment.points[0],
        pointIndex: 0,
        types: [prevSegment.type, segment.type],
        isOnTopOrBottomLine: isTopOrBottomLine(prevSegment) || isTopOrBottomLine(segment),
        isEndPoint: true,
        location: isTopOrBottomLine(segment) ? (isTopLine(segment) ? 'left' : 'right') : segment.location,
      }].concat(segment.points.slice(1, -1).map((point, pointIndex) => {
        return {
          startSegmentId: segment.id,
          startSegmentIndex: segmentIndex,
          point,
          pointIndex: 1 + pointIndex,
          types: [segment.type],
          isOnTopOrBottomLine: false,
          isEndPoint: false,
          location: segment.location,
        }
      }));
      prevSegment = segment;

      return newAnchorsInSegment;
    });
  });

  // Anchor coordinates, that are not on the two horizontal lines.
  let nonHorizontalAnchors = anchors.filter(anchor => !anchor.isOnTopOrBottomLine);

  const handleAnchorDrag = (anchor, newPosition) => {
    const segmentIndex = anchor.startSegmentIndex;
    const pointIndex = anchor.pointIndex;

    let minX = 10;
    let minY = 10;
    let maxX = sceneSize.width - 11;
    let maxY = sceneSize.height - 11;
    // let nonHorizontalAnchorMaxX

    newPosition.x = Math.min(Math.max(newPosition.x, minX), maxX);
    newPosition.y = Math.min(Math.max(newPosition.y, minY), maxY);

    console.log(`maxX: ${maxX}`);
    console.log(`maxY: ${maxY}`);

    console.log(`newPosition.x: ${newPosition.x}`);
    console.log(`newPosition.y: ${newPosition.y}`);

    setSegments(
      produce(segments, draft => {
        const nextSegment = draft[segmentIndex];
        const prevSegment = draft[(draft.length + segmentIndex - 1) % draft.length];

        nextSegment.points[pointIndex] = newPosition;
        if (pointIndex === 0) {
          const prevSegmentPoints = prevSegment.points;
          prevSegmentPoints[prevSegmentPoints.length - 1] = newPosition;
        }
        if (isTopOrBottomLine(nextSegment)) {
          const nextNextSegment = draft[(segmentIndex + 1) % draft.length];
          nextSegment.points[1].y = nextNextSegment.points[0].y = newPosition.y;
        }
        if (isTopOrBottomLine(prevSegment) && pointIndex === 0) {
          const prevPrevSegment = draft[(draft.length + segmentIndex - 2) % draft.length];
          prevSegment.points[0].y = prevPrevSegment.points[prevPrevSegment.points.length - 1].y = newPosition.y;
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
              <Text text={`sceneSize.height: ${sceneSize.height}`} x={0} y={20}></Text>
              <Text text={`stageSize.width: ${stageSize.width}`} x={0} y={40}></Text>
              <Text text={`stageSize.height: ${stageSize.height}`} x={0} y={60}></Text>
              <Text text={`stageSize.scale: ${stageSize.scale}`} x={0} y={80}></Text>

              {/* Render the actual path */}
              {segments.map((segment) => (
                <Line
                  key={`path-${segment.id}`}
                  stroke="black"
                  strokeWidth={2}
                  points={segment.points.flatMap(p => [p.x, p.y])}
                  bezier={segment.type === 'bezier'}
                  tension={segment.type === 'tension' ? segment.tension : 0}
                />
              ))}

              {/* Render guide lines for bezier and tension segments */}
              {segments
                .filter(segment => ['bezier', 'tension'].includes(segment.type))
                .map((segment) => (
                  <Line
                    key={`guide-${segment.id}`}
                    stroke="black"
                    strokeWidth={1}
                    dash={[5, 5]}
                    opacity={0.5}
                    points={segment.points.flatMap(p => [p.x, p.y])}
                  />
                ))
              }

              {/* Render draggable anchor points */}
              {anchors.map(anchor => 
                <Circle
                  key={`${anchor.startSegmentId}-${anchor.pointIndex}`}
                  position={anchor.point}
                  radius={6}
                  stroke={"blue"}
                  strokeWidth={1}
                  fill={anchor.isEndPoint ? "blue" : "white"}
                  draggable
                  onDragMove={(e) => handleAnchorDrag(anchor, e.target.position())}
                />
              )}
            </Layer>
          </Stage>
        </div>
      </main>
    </>
  );
}

export default FitArea
