import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AsyncSelect from 'react-select/async';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import moment from 'moment';
import { Formik } from 'formik';
import {
  object as yupObject,
  number as yupNumber,
  string as yupString,
  array as yupArray,
} from 'yup';

import api from 'gdd-api-lib';

// modal sections
import Info from './Info';
import Commission from './Commission';
import Coupons from './Coupons';

import { addNotification } from 'actions/notifications';
import { useUpdateOffer } from 'hooks/useBrands';
import { useNonprofit } from 'hooks/useNonprofits';
import DateInput from 'components/DateInput';
import { stringToBool } from 'utils';
import styles from './OfferEditModal.module.scss';

/**
 * @typedef {object} Coupon
 * @property {string} begins_at (date-time) example 2020-08-27T16:07:47
 * @property {string} code
 * @property {string} description
 * @property {string} ends_at (date-time) example 2020-08-27T16:07:47
 * @property {number} id
 */

/**
 * @typedef BrandOffer
 * @property {object} offer
 * @property {number} offer.affiliate_network_id
 * @property {string} offer.affiliate_network_name
 * @property {string} offer.offer_type offer type
 * @property {string} offer.offer_guid global offer guid
 * @property {number} offer.supported_nonprofit_id reference to associated nonprofit if any
 * @property {string} offer.disclaimer terms and conditions associated with the offer
 * @property {number} offer.commission commission of brand's active affiliate program
 * @property {string} offer.commission_type commission type of brand's active affiliate program
 * @property {number} offer.base_consumer_payout base commission payout to consumer from a brand
 * @property {string} offer.begins_at when the offer starts
 * @property {string} offer.ends_at when the offer ends
 * @property {boolean} offer.is_disabled determines if a brand is visible to external users
 * @property {boolean} offer.is_groomed determines if a brand is ready for external use
 * @property {Coupon[]} offer.coupons
 */

const schema = yupObject({
  begins_at: yupString().required('Begins at date cannot be empty.'),
  base_consumer_payout: yupNumber()
    .typeError('Consumer Payout must be a number')
    .required('Consumer Payout cannot be empty.'),
  commission_percent: yupNumber()
    .moreThan(-1, 'Must be a positive number or 0')
    .typeError('Commission must be a number')
    .required('Commission cannot be empty.'),
  commission_flat: yupNumber()
    .moreThan(-1, 'Must be a positive number or 0')
    .typeError('Commission must be a number')
    .required('Commission cannot be empty.'),
  disclaimer: yupString().nullable(),
  supported_nonprofit_id: yupNumber()
    .typeError('Supported Nonprofit ID must be a number')
    .nullable(),
  coupons: yupArray().of(
    yupObject().shape({
      begins_at: yupString(),
      ends_at: yupString(),
      code: yupString(),
      description: yupString(),
    })
  ),
});

const loadOptions = async inputValue => {
  const res = await api.searchNonprofits({ search_term: window.btoa(inputValue) });
  const newRes = res.data.nonprofits.map(data => {
    return { value: data.id, label: data.name };
  });
  return newRes;
};

const APModal = ({ show, handleClose, offer, addNotification, brand_id }) => {
  const [updateOffer] = useUpdateOffer();
  const { data: supportedNP } = useNonprofit(offer?.supported_nonprofit_id);

  if (!offer) return null;

  if (offer.commission_type === 'PERCENT') {
    offer.commission_percent = offer.commission * 100;
    offer.commission_flat = 0;
  } else {
    offer.commission_flat = offer.commission || 0;
    offer.commission_percent = 0;
  }

  return (
    <Modal show={show} onHide={handleClose} dialogClassName={styles.modal}>
      <Modal.Header closeButton>
        <Modal.Title>
          Program ID: {offer.program_id}
          <br />
          {offer.created_at ? `(Created ${moment(offer.created_at).format('MM/DD/YY')})` : ''}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={offer}
          validationSchema={schema}
          onSubmit={({
            offer_type,
            offer_guid,
            supported_nonprofit_id,
            disclaimer,
            commission_percent,
            commission_flat,
            commission_type,
            is_disabled,
            is_groomed,
            begins_at,
            ends_at,
            coupons,
          }) => {
            const form = {
              offer_type,
              offer_guid,
              supported_nonprofit_id: parseInt(supported_nonprofit_id),
              disclaimer,
              commission:
                commission_type === 'PERCENT' ? commission_percent / 100 : commission_flat,
              base_consumer_payout:
                commission_type === 'PERCENT' ? commission_percent / 100 : commission_flat,
              commission_type,
              is_disabled: stringToBool(is_disabled),
              is_groomed: stringToBool(is_groomed),
              begins_at,
              ends_at,
              coupons,
            };
            updateOffer({ form, brand_id })
              .then(() => {
                addNotification(`Offer update success`, 'success');
                handleClose();
              })
              .catch(() => {
                addNotification(`Offer update failed. Something went wrong.`, 'fail');
              });
          }}
        >
          {props => {
            const { values, errors, touched, handleSubmit, handleChange } = props;

            return (
              <Form noValidate onSubmit={handleSubmit}>
                {/* Meta info section - non-editbale  ******************/}
                <Info offer={offer} />

                {/* Everything else below is editable  ***********************/}
                {/* Select nonprofit, performs a search via our api **********/}
                <Form.Row>
                  <Form.Group as={Col}>
                    <Form.Label>
                      <b>Supported Nonprofit: </b>
                    </Form.Label>
                    <AsyncSelect
                      defaultValue={{ value: supportedNP?.id, label: supportedNP?.name }}
                      cacheOptions
                      loadOptions={loadOptions}
                      isSearchable={true}
                      isClearable
                      onChange={e => {
                        values.supported_nonprofit_id = e?.value || null;
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.supported_nonprofit_id}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>

                {/* Offer Start + End Dates **********/}
                <Form.Row>
                  <Form.Group as={Col} controlId="beginsAt">
                    <Form.Label>
                      <b>Start Date:</b>
                    </Form.Label>
                    <DateInput
                      name="begins_at"
                      value={moment(values.begins_at).format('yyyy-MM-DD')}
                      onChange={handleChange}
                      isInvalid={touched.begins_at && errors.begins_at}
                      errorMsg={errors.begins_at}
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="endsAt">
                    <Form.Label>
                      <b>End Date:</b>
                    </Form.Label>
                    <DateInput
                      name="ends_at"
                      value={moment(values.ends_at).format('yyyy-MM-DD')}
                      onChange={handleChange}
                      isInvalid={touched.ends_at && errors.ends_at}
                      errorMsg={errors.ends_at}
                    />
                  </Form.Group>
                </Form.Row>

                {/* Commission section **********/}
                <Commission offer={offer} formik={props} />

                {/* Offer bool flags **********/}
                <Form.Row>
                  <Form.Group as={Col}>
                    <p id="offerModalIsDisabled" className="d-inline mr-4">
                      <b>Is Disabled:</b>
                    </p>
                    <Form.Check
                      inline
                      label="true"
                      type="radio"
                      name="is_disabled"
                      value={true}
                      checked={values.is_disabled === 'true' || values.is_disabled === true}
                      onChange={handleChange}
                      aria-describedby="offerModalIsDisabled"
                      id="offerModalIsDisabled-TRUE"
                    />
                    <Form.Check
                      inline
                      label="false"
                      onChange={handleChange}
                      type="radio"
                      name="is_disabled"
                      value={false}
                      checked={values.is_disabled === 'false' || values.is_disabled === false}
                      aria-describedby="offerModalIsDisabled"
                      id="offerModalIsDisabled-FALSE"
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col}>
                    <p id="offerModalIsGroomed" className="d-inline mr-4">
                      <b>Is Groomed:</b>
                    </p>
                    <Form.Check
                      inline
                      label="true"
                      type="radio"
                      name="is_groomed"
                      value={true}
                      checked={values.is_groomed === 'true' || values.is_groomed === true}
                      onChange={handleChange}
                      aria-describedby="offerModalIsGroomed"
                      id="offerModalIsGroomed-TRUE"
                    />
                    <Form.Check
                      inline
                      label="false"
                      onChange={handleChange}
                      type="radio"
                      name="is_groomed"
                      value={false}
                      checked={values.is_groomed === 'false' || values.is_groomed === false}
                      aria-describedby="offerModalIsGroomed"
                      id="offerModalIsGroomed-FALSE"
                    />
                  </Form.Group>
                </Form.Row>

                {/* Offer Disclaimer text **********/}
                <Form.Row>
                  <Form.Group as={Col}>
                    <Form.Label>
                      <b>Disclaimer:</b>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      value={values.disclaimer ?? ''}
                      id="disclaimer"
                      aria-describedby="disclaimer"
                      isInvalid={!!errors.disclaimer}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.disclaimer}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>

                {/* Coupons section **********/}
                <Coupons offer={offer} formik={props} />

                <Row>
                  <Col className="text-right">
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>{' '}
                    <Button variant="primary" type="submit">
                      Save Changes
                    </Button>
                  </Col>
                </Row>
              </Form>
            );
          }}
        </Formik>
      </Modal.Body>

      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

APModal.propTypes = {
  addNotification: PropTypes.func.isRequired,
};

export default connect(null, { addNotification })(APModal);
