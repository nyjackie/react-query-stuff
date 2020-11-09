if (process.env.NODE_ENV === 'production') {
  // borrowed from: https://github.com/h5bp/html5-boilerplate/blob/v8.0.0/src/js/plugins.js
  const noop = function () {};
  for (let method of Object.keys(window.console)) {
    window.console[method] = noop;
  }
}
