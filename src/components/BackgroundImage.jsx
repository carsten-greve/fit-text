import useImage from 'use-image';
import { Image } from 'react-konva';

export const BackgroundImage = ({ url, stageSize }) => {
  const [img] = useImage(url); // Converts URL string to HTMLImageElement

  if (!img) return null;

  const scale = Math.min(stageSize.width / img.width, stageSize.height / img.height);
  const x = (stageSize.width - img.width * scale) / 2;
  const y = (stageSize.height - img.height * scale) / 2;

  return (
    <Image
      image={img}
      x={x} 
      y={y}
      scaleX={scale} 
      scaleY={scale} 
      opacity={0.3}
      listening={false}
    />
  );
};
