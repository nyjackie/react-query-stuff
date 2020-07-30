import { string as yupString } from 'yup';

/**
 * Re-usable yup validation schemas
 */

const emailMsg = 'Please enter a valid @gooddeedsdata.com email';

export default {
  /**
   * Validation for admin portal email which requires that users work for
   * gooddeedsdata.com
   */
  email: yupString()
    .trim()
    .max(250, 'email is too long (max: 250)')
    .email(emailMsg)
    .matches(/@gooddeedsdata.com$/, emailMsg)
    .required(emailMsg),
};
