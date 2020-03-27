import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import RollDice from './components/roll-dice';
import Rolls from './components/rolls';

function App() {
  return (
    <div className="container">
      <Rolls/>
      <RollDice />
    </div>
  );
}

export default App;
