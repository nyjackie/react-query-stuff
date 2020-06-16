/**
 * Wrapper around setTimeout to use within in an async function and have it wait
 * for X number of ms
 * @param {number} ms millisecons for setTimeout
 * @return {Promise<null>}
 */
export const wait = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

export const fakeJWT = () => {
  const header = { typ: 'JWT', alg: 'HS256' };
  const segments = [];
  segments.push(btoa(JSON.stringify(header)));
  segments.push(btoa(JSON.stringify({ user: 'fakeUser' })));
  segments.push('fake-signed-string-which-will-never-be-decoded');

  return segments.join('.');
};
