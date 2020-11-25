import 'utils/no-console';
import React from 'react';
import ReactDOM from 'react-dom';
import 'styles/global.scss';
import App from './App';

import { Provider } from 'react-redux';
import { ReactQueryConfigProvider } from 'react-query';
import store from 'store';
import reportWebVitals from './reportWebVitals';

// kick off setting up our api
import 'api/setup';

const queryConfig = {
  queries: {
    /**
     * This makes queries stale after 5 minutes instead of immediately
     */
    // staleTime: 1000 * 60 * 5,

    /**
     * our default should be no retries.
     */
    retry: false,
  },
};

ReactDOM.render(
  <React.StrictMode>
    <ReactQueryConfigProvider config={queryConfig}>
      <Provider store={store}>
        <App />
      </Provider>
    </ReactQueryConfigProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
