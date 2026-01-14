import { Fragment } from 'react';
import { useApp } from '../AppProvider';
import { Stage, Layer, Text } from 'react-konva';
import { produce } from 'immer'
import { BackgroundImage } from './BackgroundImage';
import { Segment } from './Segment';
import { ControlPolygon } from './ControlPolygon';
import { Anchor } from './Anchor';

const FitArea = () => {
  const { stageSize, sceneSize, konvaRef, segments, setSegments, imageUrl, setSelectedSegmentId } = useApp();

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

  return (
    <main className="relative flex-1 w-full bg-gray-100 overflow-hidden" ref={konvaRef}>
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        scaleX={stageSize.scale}
        scaleY={stageSize.scale}
        onClick={() => setSelectedSegmentId(0)}
      >
        <Layer>
          {imageUrl && <BackgroundImage url={imageUrl} stageSize={stageSize} />}
          <Text text={`sceneSize.width: ${sceneSize.width}`} x={0} y={0}></Text>
          <Text text={`sceneSize.height: ${sceneSize.height}`} x={0} y={20}></Text>
          <Text text={`stageSize.width: ${stageSize.width}`} x={0} y={40}></Text>
          <Text text={`stageSize.height: ${stageSize.height}`} x={0} y={60}></Text>
          <Text text={`stageSize.scale: ${stageSize.scale}`} x={0} y={80}></Text>

          {segments.map(segment =>
            <Fragment key={segment.id}>
              {['bezier', 'tension'].includes(segment.type) && <ControlPolygon
                key={`guide-${segment.id}`}
                segment={segment}
              />}
              <Segment
                key={`path-${segment.id}`}
                segment={segment}
              />
            </Fragment>
          )}

          {anchors.map(anchor =>
            <Anchor
              key={`${anchor.startSegmentId}-${anchor.pointIndex}`}
              anchor={anchor}
            />
          )}
        </Layer>
      </Stage>
    </main>
  );
}

export default FitArea
