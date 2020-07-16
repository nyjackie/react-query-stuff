/**
 * a global error handler just in case we want to start using some kind of third
 * party error tracking
 * @param {Error|string|object} err
 */
export default function handleError() {
  // for now it's just this but maybe in the future we might be sending
  // data via an API or something.
  console.error(...arguments);
}
