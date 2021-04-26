import React from 'react';
import { HashRouter, Route } from 'react-router-dom';

import Landing from './layouts/Landing';
import Editor from './layouts/Editor';
import Docs from './layouts/Docs';

const App = () => {
  return (
    <HashRouter>
      <Route exact path="/" component={Landing} />
      <Route path="/editor" component={Editor} />
      {/* <Route path="/docs" component={Docs} /> */}
      <Route path="/docs/:id?" component={Docs} />
    </HashRouter>
  );
};

export default App;
