import { useApp } from '../AppProvider';
import { Text } from 'react-konva';
import { getTextArea } from '../utilities/getTextArea';
import { getTopLineY, getBottomLineY } from '../utilities/topBottom';

export const FittedText = () => {
  const { segments } = useApp();

  if (segments.length === 0) return;

  const textArea = getTextArea(segments, 100);

  const topLineY = getTopLineY(segments);
  const bottomLineY = getBottomLineY(segments);

  const text = 'test';
  const middleY = (topLineY + bottomLineY - measure(text).height) / 2;
  const minMax = textArea.getMinMax(middleY);
  const middleX = (minMax.leftX + minMax.rightX - measure(text).width) / 2;

  return (
    <Text text={'test'} x={middleX} y={middleY}></Text>
  );
}

const measure = (text) => {
  const konvaText = new Konva.Text({
    fontSize: 12,
    fontFamily: 'Arial',
  });
  return konvaText.measureSize(text);

  // const canvas = document.createElement('canvas');
  // const ctx = canvas.getContext('2d');
  // ctx.font = `normal 12px 'Arial'`;

  // let metrics = ctx.measureText(text);
  // let fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
  // let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

  // return {width: metrics.width, height: fontHeight};
}
