import React from 'react';
import LabWorkList from './components/LabWorkList';
import LabWorkDetails from './components/LabWorkDetails';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LabWorkList />} />
            <Route path="/labworks/:id" element={<LabWorkDetails />} />
          </Routes>
        </div>
      </Router>
  );
};

export default App;
