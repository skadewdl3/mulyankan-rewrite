import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Landing from './layouts/Landing';
import Editor from './layouts/Editor';
import Docs from './layouts/Docs';

const App = () => {
  return (
    <BrowserRouter>
      <Route exact path="/" component={Landing} />
      <Route path="/editor" component={Editor} />
      <Route path="/docs/:id?" component={Docs} />
    </BrowserRouter>
  );
};

export default App;
