import React, { useState } from "react";
import logo from "./logo.svg";
import { Counter } from "./features/counter/Counter";
import Watchlist from "./features/Watchlist/Watchlist";
import "./App.css";

function App() {
  

  return (
    <div className="App">
      <Watchlist />
    </div>
  );
}

export default App;
