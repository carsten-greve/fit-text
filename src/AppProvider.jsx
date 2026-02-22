import { createContext, useState, useContext, useRef, useEffect, useMemo, useCallback } from 'react';
import { produce } from 'immer';
import { getAnchors } from './utils/anchorUtils';
import { getSegments } from './utils/segmentUtils';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  let fontId = 1;

  const [sceneSize, setSceneSize] = useState({});
  const [stageSize, setStageSize] = useState({});
  const konvaRef = useRef(null);
  const [_segments, _setSegments] = useState({
    byId: {},    // { 'id1': { id: 'id1', name: '...' }, ... }
    allIds: []   // ['id1', 'id2', ...]
  });
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedSegmentId, setSelectedSegmentId] = useState(0);
  const [sampleCount, setSampleCount] = useState(500);
  const [fontSize, setFontSize] = useState(12);
  const [lineSpacing, setLineSpacing] = useState(1.5);
  const [textToFit, setTextToFit] = useState(
`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`);
  const [isAutoFitting, setIsAutoFitting] = useState(false);
  const [selectedFont, setSelectedFont] = useState({ key: fontId, name: 'Times' });
  const [fontList, setFontList] = useState([
    { id: fontId++, name: 'Times' },
    { id: fontId++, name: 'Helvetica' },
  ]);
  const [nextFontId, setNextFontId] = useState(fontId);
  const [paragraphIndent, setParagraphIndent] = useState(20);
  const [isFirstLineIndent, setIsFirstLineIndent] = useState(false);

  const sceneSizeRef = useRef();
  sceneSizeRef.current = sceneSize;

  const updateSize = () => {
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
    setSegments([
      {
        id: '1',
        nextSegmentId: '2',
        prevSegmentId: '4',
        type: 'line',
        orientation: 'horizontal',
        location: 'top',
        points: [{x: left, y: top}, {x: right, y: top}]
      },
      {
        id: '2',
        nextSegmentId: '3',
        prevSegmentId: '1',
        type: 'line',
        orientation: null,
        location: 'right',
        points: [{x: right, y: top}, {x: right, y: bottom}]
      },
      {
        id: '3',
        nextSegmentId: '4',
        prevSegmentId: '2',
        type: 'line',
        orientation: 'horizontal',
        location: 'bottom',
        points: [{x: right, y: bottom}, {x: left, y: bottom}]
      },
      {
        id: '4',
        nextSegmentId: '1',
        prevSegmentId: '3',
        type: 'line',
        orientation: null,
        location: 'left',
        points: [{x: left, y: bottom}, {x: left, y: top}]
      },
    ]);

    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  const setSegments = useCallback((input) => {
    _setSegments(produce((draft) => {
      const currentArray = draft.allIds.map(id => draft.byId[id]);
      const nextArray = typeof input === 'function' ? input(currentArray) : input;

      if (!nextArray || nextArray.length === 0) {
        draft.byId = {};
        draft.allIds = [];
        return;
      }

      draft.allIds = nextArray.map(s => s.id);

      nextArray.forEach((segment, i) => {
        const nextId = nextArray[(i + 1) % nextArray.length].id;
        const prevId = nextArray.at(i - 1).id;

        draft.byId[segment.id] = {
          ...segment,
          nextSegmentId: nextId,
          prevSegmentId: prevId
        };
      });
    }));
  }, []);

  const addSegmentAfter = useCallback((targetId, newSegmentData) => {
    setSegments(prevArray => {
      const targetIndex = prevArray.findIndex(s => s.id === targetId);
      const newSegment = { ...newSegmentData, id: crypto.randomUUID() };

      if (targetIndex === -1) return [...prevArray, newSegment];

      const nextArray = [...prevArray];
      nextArray.splice(targetIndex + 1, 0, newSegment);

      return nextArray;
    });
  }, [setSegments]);

  const removeSegment = useCallback((id) => {
    setSegments(prev => prev.filter(s => s.id !== id));
  }, [setSegments]);

  const updateSegment = useCallback((id, input) => {
    _setSegments(prev => produce(prev, draft => {
      const segment = draft.byId[id];

      if (!segment) return;

      const updates = typeof input === 'function' ? input(segment) : input;

      Object.assign(segment, updates);
    }));
  }, []);

  const segments = useMemo(() => {
    return getSegments(_segments);
  }, [_segments]);

  const value = useMemo(() => {
    const { anchors: computedAnchors, segmentEndpointAnchors: computedSegmentEndpointAnchors } = getAnchors(segments);
    const computedEndPointAnchors = computedAnchors.filter(anchor => anchor.isEndPoint);
    computedEndPointAnchors.forEach((endPointAnchor, i) => {
      endPointAnchor.nextEndPointAnchor = computedEndPointAnchors[(i + 1) % computedEndPointAnchors.length];
      endPointAnchor.prevEndPointAnchor = computedEndPointAnchors.at(i - 1);
    });

    return {
      sceneSize,
      stageSize,
      konvaRef,
      _segments,
      segments,
      setSegments,
      addSegmentAfter,
      removeSegment,
      updateSegment,
      anchors: computedAnchors,
      endPointAnchors: computedEndPointAnchors,
      segmentEndpointAnchors: computedSegmentEndpointAnchors,
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
      paragraphIndent,
      setParagraphIndent,
      isFirstLineIndent,
      setIsFirstLineIndent,
    };
  }, [
    sceneSize,
    stageSize,
    konvaRef,
    _segments,
    segments,
    setSegments,
    addSegmentAfter,
    removeSegment,
    updateSegment,
    imageUrl,
    selectedSegmentId,
    sampleCount,
    fontSize,
    lineSpacing,
    textToFit,
    isAutoFitting,
    fontList,
    selectedFont,
    nextFontId,
    paragraphIndent,
    isFirstLineIndent,
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
