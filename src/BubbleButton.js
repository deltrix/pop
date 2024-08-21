import React from 'react';
import './BubbleButton.css';

function BubbleButton({ isPressed, onMouseDown }) {
  return (
    <button
      className={`bubble-button ${isPressed ? 'pressed' : ''}`}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none',
        MozUserSelect: 'none',
        WebkitUserDrag: 'none',
        MozUserDrag: 'none',
      }}
      draggable="false"
    >
    </button>
  );
}

export default BubbleButton;
