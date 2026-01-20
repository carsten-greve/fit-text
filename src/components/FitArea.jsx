import { Fragment } from 'react';
import { useApp } from '../AppProvider';
import { Stage, Layer, Text, Path } from 'react-konva';
import { BackgroundImage } from './BackgroundImage';
import { Segment } from './Segment';
import { ControlPolygon } from './ControlPolygon';
import { Anchor } from './Anchor';
import { FittedText } from './FittedText';
import { getAnchors } from '../utilities/getAnchors';

const FitArea = () => {
  const {
    stageSize,
    sceneSize,
    konvaRef,
    segments,
    imageUrl,
    setSelectedSegmentId,
    // textArea,
  } = useApp();

  const anchors = getAnchors(segments);

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

          <FittedText />

          {/* {textArea.leftPoints.at(0) && <Path data={
            textArea.leftPoints.reduce((path, point, i) => {
              return `${path} ${i === 0 ? "M" : "L"}${point.x},${point.y}`
            }, '')
          } dash={[10,10]} stroke={'cyan'} listening={false} />}

          {textArea.rightPoints.at(0) && <Path data={
            textArea.rightPoints.reduce((path, point, i) => {
              return `${path} ${i === 0 ? "M" : "L"}${point.x},${point.y}`
            }, '')
          } dash={[10,10]} stroke={'cyan'} listening={false} />} */}
        </Layer>
      </Stage>
    </main>
  );
}

export default FitArea
