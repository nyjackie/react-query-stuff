if (process.env.NODE_ENV === 'production') {
  // borrowed from: https://github.com/h5bp/html5-boilerplate/blob/v8.0.0/src/js/plugins.js
  const noop = function () {};
  const methods = [
    'assert',
    'clear',
    'count',
    'debug',
    'dir',
    'dirxml',
    'error',
    'exception',
    'group',
    'groupCollapsed',
    'groupEnd',
    'info',
    'log',
    'markTimeline',
    'profile',
    'profileEnd',
    'table',
    'time',
    'timeEnd',
    'timeline',
    'timelineEnd',
    'timeStamp',
    'trace',
    'warn',
  ];
  for (let method of methods) {
    window.console[method] = noop;
  }
}
