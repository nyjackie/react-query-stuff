import React from 'react';
import ReactDOM from 'react-dom';
import 'styles/global.scss';
import App from './App';

// kick off setting up our api
import 'api/setup';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
