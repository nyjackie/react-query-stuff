/* eslint-disable no-console */
function errorTypes(err) {
  if (err.response) {
    // this is an API error
    return `API responded with: ${err.response.status}, for route: ${err.config.url}`;
  }
}

/**
 * a global error handler
 *
 * TODO: this should eventually get a more defined interface and integrate with
 * a third party like bugsnag or similar
 */
export default function handleError() {
  [...arguments].forEach(arg => {
    let msg = [];
    if (arg instanceof Error) {
      const specialErrors = errorTypes(arg);
      if (specialErrors) {
        msg.push(specialErrors);
      }
    }
    msg.push(arg);
    console.error(...msg);
  });
}
