import errorHandler from './errorHandler';
import { dateFmt } from 'components/DateInput';
import { getNow } from 'utils/datetime';

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

/**
 * checks whether the timestamp provide is within <given seconds> of right now
 * @param {string} expiry unix epoch timestamp in seconds from jwt.user.exp
 * @param {number} [seconds=30] set how many seconds before expire to check
 * @param {boolean} [debug=false] turn on console log
 * @returns {boolean} true if timestamp is <= seconds
 */
export function willExpire(expiry, seconds = 30) {
  const now = getNow();
  if (!expiry) return true;
  return now > expiry - seconds;
}

/**
 * Decode a Basic Auth Base64 encoded basic auth username:password string
 * @param {string} encrypted
 */
export const decodeBasicAuth = encrypted => {
  //  'Basic ' + window.btoa(email + ':' + password),
  const parts = window.atob(encrypted.substring(6)).split(':');
  return {
    email: parts[0],
    password: parts[1],
  };
};

export function getTextNodeWidth(textNode) {
  var range = document.createRange();
  range.selectNodeContents(textNode);
  var rects = range.getClientRects();
  if (rects.length > 0) {
    return rects[0].width;
  }
  return 0;
}

function addToObj(obj, key, val, encode) {
  if (encode) {
    obj[encodeURIComponent(key)] = encodeURIComponent(val);
  } else {
    obj[key] = val;
  }
  return obj;
}

/**
 * Create an object from all form element names and values
 * @param {HTMLFormElement} form
 * @param {boolean} encode whether to run encodeUriComponent on both the key and values
 */
export function serialize(form, encode = true) {
  const formData = new FormData(form);
  let data = {};
  for (let pair of formData.entries()) {
    data = addToObj(data, pair[0], pair[1], encode);
  }
  return data;
}

/**
 * Converts a flat (no nested properties) object into a URL search query string
 * @param {object} data
 */
export function toQueryString(data) {
  return new URLSearchParams(data).toString();
}

/**
 * Converts a URL query/search string into an object
 *
 * for example: "?first_name=Charlie&last_name=Foxtrot&role=human"
 * becomes: { first_name: "Charlie", last_name: "Foxtrot", role: "human" }
 *
 * @param {string} str
 * @returns {object}
 */
export function fromQueryString(str) {
  if (str.startsWith('?')) {
    str = str.substring(1);
  }
  return str.split('&').reduce((acc, pair) => {
    const [key, val] = pair.split('=');
    if (key) {
      acc[key] = val;
    }
    return acc;
  }, {});
}

export function queryEncode(str) {
  const param = new URLSearchParams({ query: str });
  return param.toString();
}

export function queryDecode(str) {
  try {
    return decodeURIComponent(str.replace(/\+/g, '%20'));
  } catch (err) {
    errorHandler(err);
    return '';
  }
}

export function getSearchQuery(location = {}) {
  if (!location.search || !window.location.search) {
    return {};
  }

  const query = {};

  const params = new URLSearchParams(location.search || window.location.search);
  for (const [key, value] of params.entries()) {
    query[key] = value;
  }

  return query;
}

/**
 * recursively removes properties from `data` object that don't exist in
 * `source` object.
 * test https://repl.it/repls/ReadyWorthyLinks#index.js
 * @param {object} data
 * @param {object} source
 */
export function objectFilter(data, source) {
  const newData = { ...source };
  for (const key in data) {
    const currentVal = data[key];

    if (key in source) {
      if (typeof currentVal === 'object') {
        newData[key] = objectFilter(currentVal, source[key]);
      }

      newData[key] = currentVal || source[key];
    } else {
      newData[key] = source[key];
    }
  }
  return newData;
}

/**
 * completely replace an object inside an array with a new one
 * assumes all objects structured the same and have obj[key] property
 * @param {object[]} collection
 * @param {string} key
 * @param {object} newData
 * @returns {object[]} collection with replaced item
 * @throws Uncaught TypeError if item[key] does not exist in any object
 */
export function updateCollection(collection, key, newData) {
  return collection.map(item => {
    if (String(item[key]) === String(newData[key])) {
      return newData;
    }
    return item;
  });
}

/**
 * Replaces all properties with null values in a flat object with an empty
 * string
 * @param {object} obj
 */
export function nullToEmpty(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    const val = obj[key];
    acc[key] = val === null ? '' : val;
    return acc;
  }, {});
}

/**
 * compares newObj to source and filters out duplicate properties
 * @param {object} source source object to compare to
 * @param {object} newObj new object to check against source
 */
export function dedupeObj(source, newObj) {
  const finalObj = {};
  for (const key in newObj) {
    const val1 = source[key];
    const val2 = newObj[key];
    if (val1 !== val2) {
      finalObj[key] = val2;
    }
  }
  return finalObj;
}

/**
 * Left pads a single 0 for things like dates days and months. Only inserts a
 * single zero
 * @param {number|string} n number to be left padded
 * @returns {string}
 */
function leftPad(n) {
  if (String(n).length === 1) {
    return `0${n}`;
  }
  return n;
}

/**
 * Same as dedupeObj above but specific for user profiles with phone numbers
 * The returned object will contain the phone number in the final format for the post object
 * @param {object} source
 * @param {object} newValues this is the object we're filtering
 */
export function dedupeUser(source, newValues) {
  const finalObj = {};
  for (const key in newValues) {
    const oldVal = source[key];
    let newVal = newValues[key];

    // if phone_number was updated it will be in the input masked format '(###) ###-####'
    // otherwise it will be in its original format from the db '+1##########'
    // in order to check equality we need to convert the input masked format to
    // the database format
    if (key === 'phone_number' && newVal.includes('(')) {
      newVal = `+1${newVal.replace(/\D/g, '')}`;
    }

    // if dob was updated it will be in the input masked format MM/DD/YYYY
    // otherwise it will be in its original format from the db YYYY-MM-DD
    // in order to check equality we need to convert the input masked format to
    // the database format
    if (key === 'dob' && dateFmt.test(newVal)) {
      const [m, d, y] = newVal.dob.split('/');
      newVal.dob = `${y}-${leftPad(m)}-${leftPad(d)}`;
    }

    if (oldVal !== newVal) {
      finalObj[key] = newVal;
    }
  }
  return finalObj;
}

/**
 * converts true|false strings into booleans
 * @param {"true"|"false"|boolean} bool
 * @returns {boolean}
 * @throws
 */
export function stringToBool(bool) {
  if (typeof bool === 'string') {
    if (bool.toLowerCase() === 'true') {
      return true;
    } else if (bool.toLowerCase() === 'false') {
      return false;
    } else {
      throw new Error(`bool string must be "true" or "false", received ${bool}`);
    }
  }
  if (typeof bool === 'boolean') {
    return bool;
  } else {
    throw new Error(`bool is an unexpected type: ${typeof bool}`);
  }
}

/**
 * Convert a number into USD currency format with commas
 * @param {number} num
 */
export function currency(num) {
  // Create our number formatter.
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return formatter.format(num).split('.')[0];
}
