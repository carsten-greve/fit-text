import { createContext, useState, useContext, useRef, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [sceneSize, setSceneSize] = useState({});
  const [stageSize, setStageSize] = useState({});
  const konvaRef = useRef(null);
  const [segments, setSegments] = useState([]);
  const [nextSegmentId, setNextSegmentId] = useState(5);
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedSegmentId, setSelectedSegmentId] = useState(0);

  const sceneSizeRef = useRef();
  sceneSizeRef.current = sceneSize;

  const updateSize = () => {
    console.log(`updateSize sceneWidth = ${sceneSizeRef.current.width}`);
    console.log(`updateSize sceneHeight = ${sceneSizeRef.current.height}`);

    const width = konvaRef.current.offsetWidth;
    const scale = width / sceneSizeRef.current.width;

    setStageSize({
      width: sceneSizeRef.current.width * scale,
      height: sceneSizeRef.current.height * scale,
      scale: scale
    });
  };

  useEffect(() => {
    const width = konvaRef.current.offsetWidth;
    const height = konvaRef.current.offsetHeight;

    setSceneSize({ width, height });
    setStageSize({ width, height, scale: 1 });

    const top = height / 4;
    const left = width / 4;
    const bottom = height - top;
    const right = width - left;
    const nearTop = (2 * top + bottom) / 3;
    const nearBottom = (top + 2 * bottom) / 3;
    console.log(`width: ${width}`);
    console.log(`height: ${height}`);
    console.log(`top: ${top}`);
    console.log(`left: ${left}`);
    console.log(`bottom: ${bottom}`);
    console.log(`right: ${right}`);
    setSegments([
      { id: 1, type: 'line', location: 'top', points: [{x: left, y: top}, {x: right, y: top}] },
      { id: 2, type: 'line', location: 'right', points: [{x: right, y: top}, {x: right, y: bottom}] },
      { id: 3, type: 'line', location: 'bottom', points: [{x: right, y: bottom}, {x: left, y: bottom}] },
      { id: 4, type: 'line', location: 'left', points: [{x: left, y: bottom}, {x: left, y: top}] },
    ]);
    setNextSegmentId(nextSegmentId);

    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return (
    <AppContext.Provider value={{
      sceneSize,
      stageSize,
      konvaRef,
      segments,
      setSegments,
      nextSegmentId,
      setNextSegmentId,
      imageUrl,
      setImageUrl,
      selectedSegmentId,
      setSelectedSegmentId,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
