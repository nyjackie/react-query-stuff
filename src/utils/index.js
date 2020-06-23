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

export const fakeJWT = email => {
  const header = { typ: 'JWT', alg: 'HS256' };
  const segments = [];
  segments.push(btoa(JSON.stringify(header)));
  segments.push(
    btoa(JSON.stringify({ username: 'mockUser', email: email || 'noone@gooddeedsdata.com' }))
  );
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
  let data = {};
  Array.prototype.slice.call(form.elements).forEach(function (field) {
    if (
      !field.name ||
      field.disabled ||
      ['file', 'reset', 'submit', 'button'].indexOf(field.type) > -1
    ) {
      return;
    }

    if (field.type === 'select-multiple') {
      Array.prototype.slice.call(field.options).forEach(function (option) {
        if (!option.selected) return;
        data = addToObj(data, field.name, option.value, encode);
      });
      return;
    }

    // skipped adding any unchecked or unselected items
    if (['checkbox', 'radio'].indexOf(field.type) > -1 && !field.checked) {
      return;
    }

    data = addToObj(data, field.name, field.value, encode);
  });

  return data;
}

export function toQueryString(data) {
  return Object.keys(data)
    .map(key => `${key}=${data[key]}`)
    .join('&');
}
