import { useApp } from '../AppProvider';
import { Text } from 'react-konva';
import { getShapeBoundaries } from '../utilities/getShapeBoundaries';
import { getTextLayout } from '../utilities/getTextLayout';

export const FittedText = () => {
  const { segments, sampleCount, fontSize, lineSpacing } = useApp();

  if (segments.length === 0) return;

  const shapeBoundaries = getShapeBoundaries(segments, sampleCount);
  const fontFamily = 'Arial';
  const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
  const words = text.split(/\s+/);
  const lines = getTextLayout(words, lineSpacing, shapeBoundaries, fontFamily, fontSize);

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
