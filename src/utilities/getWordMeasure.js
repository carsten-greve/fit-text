export const getWordMeasure = (word, fontFamily = 'Arial', fontSize = 12) => {
  const konvaText = new Konva.Text({
    fontFamily,
    fontSize,
  });

  return konvaText.measureSize(word);
};
