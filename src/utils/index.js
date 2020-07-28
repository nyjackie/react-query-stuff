import moment from 'moment';
import errorHandler from './errorHandler';

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
 * @param {string} timestamp UTC time stamp to check against
 * @param {number} seconds set how many seconds before expire to check
 * @returns {boolean} true if timestamp is <= seconds
 */
export function willExpire(timestamp, seconds) {
  const expires = moment(timestamp);
  const now = moment(expires).diff(moment.utc());
  const diff = moment.duration(now).asSeconds();
  return diff <= seconds;
}

export const decryptBasicAuth = encrypted => {
  //  'Basic ' + window.btoa(email + ':' + password),
  const parts = window.atob(encrypted.substring(6)).split(':');
  return {
    email: parts[0],
    password: parts[1],
  };
};

/**
 * Simple func to combine className strings
 * can make this more robust if needed like this: https://github.com/JedWatson/classnames#readme
 * @param {string} original
 * @param {string} extra
 */
export function classNames(original, extra) {
  if (original) return `${original} ${extra}`;

  return extra;
}

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

export function toQueryString(data) {
  return Object.keys(data)
    .map(key => `${key}=${data[key]}`)
    .join('&');
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

/**
 * source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
 * @param {string} str
 * @returns {string}
 */
export function fixedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}

export function queryEncode(str) {
  return fixedEncodeURIComponent(str).replace(/%20/g, '+');
}

export function queryDecode(str) {
  try {
    return decodeURIComponent(str.replace(/\+/g, '%20'));
  } catch (err) {
    errorHandler(err);
    return '';
  }
}

export function getSearchQuery(location) {
  if (!location.search) {
    return '';
  }
  const { query } = fromQueryString(location.search);
  if (query) {
    const decoded = queryDecode(query);
    if (!decoded) {
      return '';
    }
    return decoded.trim();
  }
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
    if (item[key].toString() === newData[key].toString()) {
      return newData;
    }
    return item;
  });
}
