import { getWordMeasure } from './getWordMeasure';

export const getTextLayout = (paragraphsOfWords, lineHeightRatio, shapeBoundaries, fontFamily, fontSize, paragraphIndent, isFirstLineIndent) => {
  const spaceWidth = getWordMeasure(' ', fontFamily, fontSize).width;
  const lines = [];
  let currentWordIndex = 0;
  let currentParagraphIndex = 0;
  let currentY = shapeBoundaries.topY + fontSize / 2;
  const { paragraphStartIndices, words } = paragraphsOfWords.reduce(
    (accumulator, paragraph) => ({
      paragraphStartIndices: [...accumulator.paragraphStartIndices, accumulator.words.length],
      words: [...accumulator.words, ...paragraph]
    }),
    {paragraphStartIndices: [], words: []})

  while (currentY <= shapeBoundaries.bottomY - fontSize / 2 && currentWordIndex < words.length) {
    const boundary = shapeBoundaries.getMinMax(currentY, fontSize);
    const availableWidth = boundary.rightX - boundary.leftX;
    const lineWords = [];
    const currentIndent = paragraphStartIndices[currentParagraphIndex] === currentWordIndex
      ? currentWordIndex > 0 || isFirstLineIndent ? paragraphIndent : 0
      : 0;
    let currentLineWidth = currentIndent;

    while (currentWordIndex < words.length) {
      const wordWidth = getWordMeasure(words[currentWordIndex], fontFamily, fontSize).width;
      const addedWidth = lineWords.length > 0 ? spaceWidth + wordWidth : wordWidth;

      if (currentLineWidth + addedWidth <= availableWidth &&
        (currentWordIndex === 0 || paragraphStartIndices[1 + currentParagraphIndex] !== currentWordIndex)) {
        lineWords.push({ text: words[currentWordIndex], width: wordWidth });
        currentLineWidth += addedWidth;
        currentWordIndex++;
      } else {
        break;
      }
    }

    // Calculate Justification
    if (currentWordIndex === words.length || paragraphStartIndices[1 + currentParagraphIndex] === currentWordIndex) {
      lines.push({ words: lineWords, spaceWidth, y: currentY - fontSize / 2, x: boundary.leftX + currentIndent });
    }
    else if (lineWords.length > 1) {
      const totalWordWidth = lineWords.reduce((sum, w) => sum + w.width, 0);
      const adjustedSpaceWidth = (availableWidth - currentIndent - totalWordWidth) / (lineWords.length - 1);
      lines.push({ words: lineWords, spaceWidth: adjustedSpaceWidth, y: currentY - fontSize / 2, x: boundary.leftX + currentIndent });
    }
    else if (lineWords.length === 1) { // Single word line: usually left-aligned
      lines.push({ words: lineWords, spaceWidth: 0, y: currentY - fontSize / 2, x: boundary.leftX + currentIndent });
    }

    if (paragraphStartIndices[1 + currentParagraphIndex] === currentWordIndex) {
      currentParagraphIndex++;
    }

    currentY += fontSize * lineHeightRatio;
  };

  return {
    lines,
    wordsFitRatio: currentWordIndex / words.length,
    spaceFitRatio: currentY / (shapeBoundaries.bottomY - shapeBoundaries.topY),
  };
};
