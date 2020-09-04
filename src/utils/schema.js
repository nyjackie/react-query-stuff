import { string, object, date } from 'yup';

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
  .email('Please enter a valid email')
  .matches(/@givegooddeeds\.com$/, 'email must be a valid Give Good Deeds email')
  .required('This field is required');

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
