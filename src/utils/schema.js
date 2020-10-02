import { string, object, date, number } from 'yup';

// simple function so we don't have to import yup in both places
export function createSchema(obj) {
  return object(obj);
}

/**
 * Re-usable yup validation schemas
 */

/**
 * A lot of our string max length is 255 so we can re-use this
 */
export const max255 = string()
  .ensure()
  .trim()
  .max(255, 'Max 255 characters allowed for this field');

/**
 * Validation for admin portal email which requires that users work for the
 * company or our consumer-edge
 */
export const gddEmailRequired = max255
  .required('This field is required')
  .email('Please enter a valid email')
  .matches(/@givegooddeeds\.com$/, 'Invalid email');

/**
 * Validate a phone number
 * ensures that there are between 10 and 11 digits (ignoring all other characters)
 *
 * 10 digits: XXX-XXX-XXXX
 *
 * 11 digits: X-XXX-XXX-XXXX
 */
export const phone = max255.test(
  'phone',
  'Please enter a valid US phone number, starting "1" is optional',
  value => {
    if (value.length === 0) return true;
    // remove all non-numbers from string
    const digits = value.replace(/[^0-9]+/g, '');
    // ensure phone is between 10 and 12 digits
    return digits.length >= 10 && digits.length <= 11;
  }
);

/**
 * US Zip code validation
 */
export const zipcode = max255.test('zipcode', 'Please enter a valid US zip code', value => {
  if (!value) return true;
  return /^\d{5}(?:[-\s]\d{4})?$/.test(value);
});

/**
 * Date of birth Schema handles validating that it is a valid date in the past
 * the range is Dec 31, 1899 - Today's date
 */
const pastDate = date()
  .min(new Date('1900'), 'Doubt user is over 120 years old, try again')
  .max(new Date(), 'Date of birth must be in the past');

export const dob = string()
  .ensure()
  .trim()
  .test('Date of birth', 'Date is invalid or out of range', value => {
    if (value === '') return true; // date is not required
    return pastDate.isValid(value);
  });

export const specialRegex = new RegExp('[ !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~]+');

/**
 * 8+ characters
 * at least one Uppercase
 * at least one lowercase
 * at least one Number
 * at least one Special character: https://owasp.org/www-community/password-special-characters
 */
export const password = string()
  .ensure()
  .trim()
  .required('Password can not be blank')
  .min(8, 'Password must have a minimum of 8 characters')
  .max(255, 'Max 255 characters allowed')
  .test('password numbers', 'Password contain at least one number', value => /[0-9]+/.test(value))
  .test(
    'password cases',
    'Password contain at least one uppercase and one lowercase letter',
    value => /[A-Z]+/.test(value) && /[a-z]+/.test(value)
  )
  .test('password special', 'Password contains at least one special character', value =>
    specialRegex.test(value)
  );

/**
 * schema for a regular database ID
 */
export const dbID = number().integer().positive();

// src: https://github.com/jquense/yup/blob/master/src/string.js#L9
let rUrl = /^((https?|ftp):)?(\/\/)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;

/**
 * Custom URL because yup's URL requires the protocol
 */
export const url = max255.matches(rUrl, 'Invalid URL');
