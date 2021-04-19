import React from 'react';
import { HashRouter, Route } from 'react-router-dom';

import Landing from './layouts/Landing';
import Editor from './Layouts/Editor';

const App = () => {
  return (
    <HashRouter>
      <Route exact path="/" component={Landing} />
      <Route path="/editor" component={Editor} />
    </HashRouter>
  );
};

export default App;
