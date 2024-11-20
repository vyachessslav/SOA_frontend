import React, { useState, useEffect } from 'react';
import LabWorkList from './components/LabWorkList';
import LabWorkDetails from './components/LabWorkDetails';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const App = () => {
  return (
      <Router>
        <div className="App">
          <Switch>
            <Route path="/" exact component={LabWorkList} />
            <Route path="/labworks/:id" component={LabWorkDetails} />
          </Switch>
        </div>
      </Router>
  );
};

export default App;

