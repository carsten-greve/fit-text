import { createContext, useState, useContext, useRef, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  let fontId = 1;

  const [sceneSize, setSceneSize] = useState({});
  const [stageSize, setStageSize] = useState({});
  const konvaRef = useRef(null);
  const [segments, setSegments] = useState([]);
  const [nextSegmentId, setNextSegmentId] = useState(5);
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedSegmentId, setSelectedSegmentId] = useState(0);
  const [sampleCount, setSampleCount] = useState(500);
  const [fontSize, setFontSize] = useState(12);
  const [lineSpacing, setLineSpacing] = useState(1.5);
  const [textToFit, setTextToFit] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
  const [isAutoFitting, setIsAutoFitting] = useState(false);
  const [selectedFont, setSelectedFont] = useState({ key: fontId, name: 'Times' });
  const [fontList, setFontList] = useState([
    { id: fontId++, name: 'Times' },
    { id: fontId++, name: 'Helvetica' },
  ]);
  const [nextFontId, setNextFontId] = useState(fontId);

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
      sampleCount,
      setSampleCount,
      fontSize,
      setFontSize,
      lineSpacing,
      setLineSpacing,
      textToFit,
      setTextToFit,
      isAutoFitting,
      setIsAutoFitting,
      fontList,
      setFontList,
      selectedFont,
      setSelectedFont,
      nextFontId,
      setNextFontId,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
