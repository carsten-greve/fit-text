import { getWordMeasure } from './getWordMeasure';

export const getTextLayout = (words, lineHeightRatio, shapeBoundaries, fontFamily = 'Arial', fontSize = 12) => {
  const spaceWidth = getWordMeasure(' ', fontFamily, fontSize).width;
  const lines = [];
  let currentWordIndex = 0;
  let currentY = shapeBoundaries.topY + fontSize / 2;

  while (currentY <= shapeBoundaries.bottomY - fontSize / 2 && currentWordIndex < words.length) {
    const boundary = shapeBoundaries.getMinMax(currentY, fontSize);
    const availableWidth = boundary.rightX - boundary.leftX;
    const lineWords = [];
    let currentLineWidth = 0;

    while (currentWordIndex < words.length) {
      const wordWidth = getWordMeasure(words[currentWordIndex], fontFamily, fontSize).width;
      const addedWidth = lineWords.length > 0 ? spaceWidth + wordWidth : wordWidth;

      if (currentLineWidth + addedWidth <= availableWidth) {
        lineWords.push({ text: words[currentWordIndex], width: wordWidth });
        currentLineWidth += addedWidth;
        currentWordIndex++;
      } else {
        break;
      }
    }

    // Calculate Justification
    if (currentWordIndex === words.length) { // Last line
      lines.push({ words: lineWords, spaceWidth, y: currentY - fontSize / 2, x: boundary.leftX });
    }
    else if (lineWords.length > 1) {
      const totalWordWidth = lineWords.reduce((sum, w) => sum + w.width, 0);
      const spaceWidth = (availableWidth - totalWordWidth) / (lineWords.length - 1);
      lines.push({ words: lineWords, spaceWidth, y: currentY - fontSize / 2, x: boundary.leftX });
    }
    else if (lineWords.length === 1) { // Single word line: usually left-aligned
      lines.push({ words: lineWords, spaceWidth: 0, y: currentY - fontSize / 2, x: boundary.leftX });
    }

    currentY += fontSize * lineHeightRatio;
  };

  return lines;
};
