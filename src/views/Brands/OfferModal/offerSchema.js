import {
  object as yupObject,
  number as yupNumber,
  string as yupString,
  array as yupArray,
} from 'yup';

const schema = yupObject({
  begins_at: yupString().required(
    'Begining date required and must include both a date and a time.'
  ),
  base_consumer_payout: yupNumber()
    .typeError('Consumer Payout must be a number')
    .required('Consumer Payout cannot be empty.'),

  /**
   * Commision validation is conditional on which commission_type is selected
   */
  commission_type: yupString(),
  commission_percent: yupNumber().when('commission_type', {
    is: 'PERCENT',
    then: yupNumber()
      .required('Commission cannot be empty.')
      .typeError('Commission must be a number')
      .moreThan(-1, 'Must be a positive number or 0'),
  }),
  commission_flat: yupNumber().when('commission_type', {
    is: 'FLAT',
    then: yupNumber()
      .required('Commission cannot be empty.')
      .typeError('Commission must be a number')
      .moreThan(-1, 'Must be a positive number or 0'),
  }),

  disclaimer: yupString().nullable(),
  supported_nonprofit_id: yupNumber()
    .typeError('Supported Nonprofit ID must be a number')
    .nullable(),
  coupons: yupArray().of(
    yupObject().shape({
      begins_at: yupString().nullable(),
      ends_at: yupString().nullable(),
      code: yupString().required('Code is required'),
      description: yupString().required('Description is required'),
    })
  ),
});

export default schema;
