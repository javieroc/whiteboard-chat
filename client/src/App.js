import React from 'react';
import Whiteboard from './components/Whiteboard';
import ListOfConnected from './components/ListOfConneted';
import './App.css';


function App() {
  return (
    <div className="main">
      <div><h1>This is a place to be free of the bad ideas you have and show the world how beautiful you are!</h1></div>
      <div className="container">
        <Whiteboard />
        <ListOfConnected />
      </div>
    </div>
  )
}

export default App
