import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Whiteboard.css';

const socket = io('http://localhost:3000');

const colors = {
  cyan: '#36C5F4',
  magenta: '#ED4598',
  green: '#8AFF00',
  orange: '#F05222',
  yellow: '#FFFF00',
};

function Whiteboard() {
  const [drawing, setDrawing] = useState(false);
  const [current, setCurrent] = useState({ color: colors['cyan'] });
  const canvasRef = React.useRef(null);
  useEffect(() => {
    function onDrawingEvent(data) {
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      const w = canvas.width;
      const h = canvas.height;
      drawLine(context, data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
    }

    socket.on('drawing', onDrawingEvent);
  }, []);

  function drawLine(context, x0, y0, x1, y1, color, emit) {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.stroke();
    context.closePath();

    if (!emit) { return; }
    const canvas = canvasRef.current;
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

  function onMouseDown(e) {
    setDrawing(true)
    const canvas = canvasRef.current
    const posX = e.clientX - canvas.offsetLeft;
    const posY = e.clientY - canvas.offsetTop;
    setCurrent({ ...current, x: posX, y: posY });
  }

  function onMouseUp(e) {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!drawing) { return; }
    setDrawing(false)
    const posX = e.clientX - canvas.offsetLeft;
    const posY = e.clientY - canvas.offsetTop;
    drawLine(context, current.x, current.y, posX, posY, current.color, true);
  }

  function onMouseMove(e) {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!drawing) { return; }
    const posX = e.clientX - canvas.offsetLeft;
    const posY = e.clientY - canvas.offsetTop;
    drawLine(context, current.x, current.y, posX, posY, current.color, true);
    setCurrent({ ...current, x: posX, y: posY });
  }

  function onColorClick(e) {
    const color = colors[e.target.className.split(' ')[1]];
    setCurrent({ ...current, color });
  }

  return (
    <div className="wrapper">
      <canvas
        className="whiteboard"
        ref={canvasRef}
        width={1000}
        height={600}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseOut={onMouseUp}
        onMouseMove={onMouseMove}
        onTouchStart={onMouseDown}
        onTouchEnd={onMouseUp}
        onTouchCancel={onMouseUp}
        onTouchMove={onMouseMove}
      />
      <div className="colors">
        <div className="color cyan" onClick={onColorClick} />
        <div className="color magenta" onClick={onColorClick} />
        <div className="color green" onClick={onColorClick} />
        <div className="color orange" onClick={onColorClick} />
        <div className="color yellow" onClick={onColorClick} />
      </div>
    </div>
  )
}

export default Whiteboard
