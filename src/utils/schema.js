import { string, object } from 'yup';

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

const emailMsg = 'Please enter a valid @gooddeedsdata.com email';
/**
 * Validation for admin portal email which requires that users work for
 * gooddeedsdata.com
 */
export const gddEmail = max255
  .email(emailMsg)
  .matches(/@gooddeedsdata.com$/, emailMsg)
  .required(emailMsg);

/**
 * Validate a phone number
 * ensures that there are between 10 and 12 digits (ignoring all other characters)
 *
 * 10 digits: XXX-XXX-XXXX
 *
 * 11 digits: X-XXX-XXX-XXXX
 *
 * 12 digits: XX-XXX-XXX-XXXX
 */
export const phone = max255
  .test('phone-chars', 'Phone number can not contain invalid characters', value => {
    // only allow numbers and spaces/hyphens/dots/paranthesis as delimiters
    return value.replace(/[-\s0-9.()]+/g, '').length === 0;
  })
  .test('phone-length', 'Please enter a valid phone number', value => {
    // remove all non-numbers from string
    const digits = value.replace(/[^0-9]+/g, '');
    // ensure phone is between 10 and 12 digits
    return digits.length >= 10 && digits.length <= 12;
  });
