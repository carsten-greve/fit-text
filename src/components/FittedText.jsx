import { useApp } from '../AppProvider';
import { Text } from 'react-konva';
import { getShapeBoundaries } from '../utilities/getShapeBoundaries';
import { getTextLayout } from '../utilities/getTextLayout';

export const FittedText = () => {
  const { segments, sampleCount, selectedFont, fontSize, lineSpacing, textToFit, paragraphIndent, isFirstLineIndent } = useApp();

  if (segments.length === 0) return;

  const shapeBoundaries = getShapeBoundaries(segments, sampleCount);
  const paragraphsOfWords = textToFit.split(/\n\s*\n/).map(p => p.split(/\s+/));
  const { lines } = getTextLayout(paragraphsOfWords, lineSpacing, shapeBoundaries, selectedFont.name, fontSize, paragraphIndent, isFirstLineIndent);

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
              fontFamily={selectedFont.name}
              listening={false}
            />
          );
        });
      })}
    </>
  );
}
