export const getWordMeasure = (word, fontFamily, fontSize) => {
  const konvaText = new Konva.Text({
    fontFamily,
    fontSize,
  });

  return konvaText.measureSize(word);
};
