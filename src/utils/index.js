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
  segments.push(btoa(JSON.stringify({ username: 'fakeUser', email: 'noone@gooddeedsdata.com' })));
  segments.push('long-encoded-string-signature');

  return segments.join('.');
};

export const decryptBasicAuth = encrypted => {
  //  'Basic ' + window.btoa(email + ':' + password),
  const parts = window.atob(encrypted.substring(6)).split(':');
  return {
    email: parts[0],
    password: parts[1],
  };
};
