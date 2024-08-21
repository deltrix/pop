import React, { useState, useEffect, useRef } from 'react';
import BubbleButton from './BubbleButton';
import './App.css';

function App() {
  const buttonSize = 50;
  const [numRows, setNumRows] = useState(10);
  const [numCols, setNumCols] = useState(20);
  const [pressedButtons, setPressedButtons] = useState(Array(numRows * numCols).fill(false));
  const [cursorSize, setCursorSize] = useState(1);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);

  const audioContextRef = useRef(null);
  const bufferRef = useRef(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

    const loadAudio = async () => {
      const response = await fetch('/pop.mp3');
      const arrayBuffer = await response.arrayBuffer();
      bufferRef.current = await audioContextRef.current.decodeAudioData(arrayBuffer);
    };

    loadAudio();
  }, []);

  const playSound = () => {
    if (bufferRef.current && audioContextRef.current) {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = bufferRef.current;
      source.connect(audioContextRef.current.destination);
      source.start(0);
    }
  };

  useEffect(() => {
    setPressedButtons(Array(numRows * numCols).fill(false)); // Reset grid when size changes
  }, [numRows, numCols]);

  const handleGridClick = (e) => {
    const gridRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - gridRect.left;
    const y = e.clientY - gridRect.top;

    const col = Math.floor(x / (buttonSize + 15)); 
    const row = Math.floor(y / (buttonSize + 15)); 

    const startRow = Math.max(0, row);
    const endRow = Math.min(numRows, startRow + cursorSize);
    const startCol = Math.max(0, col);
    const endCol = Math.min(numCols, startCol + cursorSize);

    const newPressedButtons = [...pressedButtons];

    for (let r = startRow; r < endRow; r++) {
      for (let c = startCol; c < endCol; c++) {
        const buttonIndex = r * numCols + c;
        if (!newPressedButtons[buttonIndex]) {
          newPressedButtons[buttonIndex] = true;
          playSound(); 
        }
      }
    }

    setPressedButtons(newPressedButtons);
  };

  const handleReset = () => {
    setPressedButtons(Array(numRows * numCols).fill(false)); 
  };

  const handleMouseMove = (e) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleMouseDown = () => {
    setIsMouseDown(true);
  };
  
  const handleMouseUp = () => {
    setIsMouseDown(false);
  };
  
  //// Wanted to make drag to pop, lag issues
  // const handleMouseOver = (index) => {
  //   if (isMouseDown) {
  //     const buttonsPerRow = numCols;
  //     const startRow = Math.floor(index / buttonsPerRow);
  //     const startCol = index % buttonsPerRow;
  
  //     const endRow = Math.min(numRows, startRow + cursorSize);
  //     const endCol = Math.min(numCols, startCol + cursorSize);
  
  //     const newPressedButtons = [...pressedButtons];
  
  //     for (let r = startRow; r < endRow; r++) {
  //       for (let c = startCol; c < endCol; c++) {
  //         const buttonIndex = r * buttonsPerRow + c;
  //         if (!newPressedButtons[buttonIndex]) {
  //           newPressedButtons[buttonIndex] = true;
  //           playSound(); 
  //         }
  //       }
  //     }
  
  //     setPressedButtons(newPressedButtons);
  //   }
  // };

  return (
    <div className="app">
      <h1>Pop!</h1>
      <div className="controls">
          <input
            className="size-slider"
            type="range"
            min="1"
            max="5"
            step="0.1"
            value={cursorSize}
            onChange={(e) => setCursorSize(Number(e.target.value))}
          />
      </div>
      <div
        className="button-grid"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} 
        onClick={handleGridClick}
        style={{
          gridTemplateColumns: `repeat(${numCols}, 50px)`,
          gridTemplateRows: `repeat(${numRows}, 50px)`,
        }}
      >
        {pressedButtons.map((isPressed, index) => (
          <BubbleButton
            key={index}
            isPressed={isPressed}
            cursorSize={cursorSize}
            onMouseDown={() => handleMouseDown(index)}
          />
        ))}
      </div>
      <button className="reset-button" onClick={handleReset}>
        reset
      </button>
      <img
        src="/custom-cursor.png"
        alt="Custom Cursor"
        className="custom-cursor"
        style={{
          width: `${300 * cursorSize}px`,
          height: `${300 * cursorSize}px`,
          left: `${cursorPosition.x - 7 * cursorSize}px`,
          top: `${cursorPosition.y - 7 * cursorSize}px`,
        }}
      />
    </div>
  );
}

export default App;
