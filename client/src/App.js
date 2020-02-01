import React, { useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:3000');


function App() {
  const [drawing, setDrawing] = useState(false);
  const [current, setCurrent] = useState({ color: 'black' });
  const canvasRef = React.useRef(null);
  socket.on('drawing', onDrawingEvent);

  function drawLine(context, x0, y0, x1, y1, color, emit) {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.stroke();
    context.closePath();

    if (!emit) { return; }
    const canvas = canvasRef.current
    const w = canvas.width;
    const h = canvas.height;

    socket.emit('drawing', {
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color: color
    });
  }

  function onDrawingEvent(data) {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const w = canvas.width;
    const h = canvas.height;
    drawLine(context, data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
  }

  function onMouseDown(e) {
    setDrawing(true)
    setCurrent({ x: e.clientX || e.touches[0].clientX, y: e.clientY || e.touches[0].clientY });
  }

  function onMouseUp(e) {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!drawing) { return; }
    setDrawing(false)
    drawLine(context, current.x, current.y, e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, current.color, true);
  }

  function onMouseMove(e) {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!drawing) { return; }
    drawLine(context, current.x, current.y, e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY, current.color, true);
    setCurrent({ x: e.clientX || e.touches[0].clientX, y: e.clientY || e.touches[0].clientY });
  }

  return (
    <div className="wrapper">
      <h3>Whiteboard</h3>
      <canvas
        className="whiteboard"
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseOut={onMouseUp}
        onMouseMove={onMouseMove}
        onTouchStart={onMouseDown}
        onTouchEnd={onMouseUp}
        onTouchCancel={onMouseUp}
        onTouchMove={onMouseMove}
      />
    </div>
  )
}

export default App