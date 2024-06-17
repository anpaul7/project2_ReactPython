import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { About } from "./components/About";
import { Users } from "./components/Users";
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar/>
      <div className="container p-2" /> 
      <div>
        <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/about" element={<About />} />
          
        </Routes>
      </div>
    </Router>

  );
}

export default App;
