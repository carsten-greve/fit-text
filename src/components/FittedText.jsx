import { useApp } from '../AppProvider';
import { Text } from 'react-konva';
import { getShapeBoundaries } from '../utilities/getShapeBoundaries';
import { getTextLayout } from '../utilities/getTextLayout';

export const FittedText = () => {
  const { segments, sampleCount, fontFamily, fontSize, lineSpacing, textToFit } = useApp();

  if (segments.length === 0) return;

  const shapeBoundaries = getShapeBoundaries(segments, sampleCount);
  const words = textToFit.split(/\s+/);
  const { lines } = getTextLayout(words, lineSpacing, shapeBoundaries, fontFamily, fontSize);

  return (
    <>
      {lines.map((line, lIdx) => {
        let currentX = line.x;
        return line.words.map((word, wIdx) => {
          const wordX = currentX;
          currentX += word.width + line.spaceWidth;
          return (
            <Text
              key={`${lIdx}-${wIdx}`}
              x={wordX}
              y={line.y}
              text={word.text}
              fontSize={fontSize}
              fontFamily={fontFamily}
              listening={false}
            />
          );
        });
      })}
    </>
  );
}
