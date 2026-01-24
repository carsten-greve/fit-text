import { Fragment } from 'react';
import { useApp } from '../AppProvider';
import { Stage, Layer } from 'react-konva';
import { BackgroundImage } from './BackgroundImage';
import { Segment } from './Segment';
import { ControlPolygon } from './ControlPolygon';
import { Anchor } from './Anchor';
import { FittedText } from './FittedText';
import { getAnchors } from '../utilities/getAnchors';

export const FitArea = () => {
  const {
    stageSize,
    konvaRef,
    segments,
    imageUrl,
    setSelectedSegmentId,
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
        </Layer>
      </Stage>
    </main>
  );
}
