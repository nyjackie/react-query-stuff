import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AsyncSelect from 'react-select/async';
import { Modal, Button, Form, Col, Row, InputGroup } from 'react-bootstrap';
import moment from 'moment';
import { Formik } from 'formik';
import { object as yupObject, number as yupNumber, string as yupString } from 'yup';

import api from 'gdd-api-lib';

import { addNotification } from 'actions/notifications';
import { useUpdateOffer } from 'hooks/useBrands';
import { useNonprofit } from 'hooks/useNonprofits';
import DateInput from 'components/DateInput';
import { stringToBool } from 'utils';
import styles from './OfferEditModal.module.scss';

/**
 * @typedef BrandOffer
 * @param {object} offer
 * @param {string} offer.offer_type offer type
 * @param {string} offer.offer_guid global offer guid
 * @param {number} offer.supported_nonprofit_id reference to associated nonprofit if any
 * @param {string} offer.disclaimer terms and conditions associated with the offer
 * @param {number} offer.commission commission of brand's active affiliate program
 * @param {string} offer.commission_type commission type of brand's active affiliate program
 * @param {number} offer.base_consumer_payout base commission payout to consumer from a brand
 * @param {string} offer.begins_at when the offer starts
 * @param {string} offer.ends_at when the offer ends
 * @param {boolean} offer.is_disabled determines if a brand is visible to external users
 * @param {boolean} offer.is_groomed determines if a brand is ready for external use
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
                <Meta label="Offer GUID:" val={offer.offer_guid} />
                <Meta label="Offer Type:" val={offer.offer_type} />
                <Meta
                  label="Shop URL:"
                  val={
                    <a href={offer.shop_url} target="_blank" rel="noopener noreferrer">
                      {offer.shop_url}
                    </a>
                  }
                />
                <Meta label="Affiliate Network Name:" val={offer.affiliate_network_name} />

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
                      isValid={touched.begins_at && !errors.begins_at}
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
                      isValid={touched.ends_at && !errors.ends_at}
                      errorMsg={errors.ends_at}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col}>
                    <p id="offerModalCommisionType" className="d-inline mr-4">
                      <b>Commission Type:</b>
                    </p>
                    <Form.Check
                      inline
                      label="PERCENT"
                      type="radio"
                      name="commission_type"
                      value="PERCENT"
                      checked={values.commission_type === 'PERCENT'}
                      onChange={handleChange}
                      aria-describedby="offerModalCommisionType"
                      id="offerModalCommisionType-PERCENT"
                    />
                    <Form.Check
                      inline
                      label="FLAT"
                      onChange={handleChange}
                      type="radio"
                      name="commission_type"
                      value="FLAT"
                      checked={values.commission_type === 'FLAT'}
                      aria-describedby="offerModalCommisionType"
                      id="offerModalCommisionType-FLAT"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.commission_type}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>
                {values.commission_type === 'PERCENT' && (
                  <>
                    <Form.Row>
                      <Col>
                        <Form.Label htmlFor="commission">
                          <b>Commission:</b>
                        </Form.Label>
                        <InputGroup>
                          <Form.Control
                            type="number"
                            value={values.commission_percent}
                            id="commission"
                            name="commission_percent"
                            aria-describedby="commission"
                            onChange={handleChange}
                            isInvalid={errors.commission_percent}
                          />

                          <InputGroup.Append>
                            <InputGroup.Text>%</InputGroup.Text>
                          </InputGroup.Append>
                          <Form.Control.Feedback type="invalid">
                            {errors.commission_percent}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Col>
                      <Form.Group as={Col} controlId="base_consumer_payout">
                        <Form.Label>
                          <b>Consumer Payout:</b>
                        </Form.Label>
                        <Form.Control
                          disabled
                          plaintext
                          value={(values.commission_percent || '0') + '%'}
                          onChange={handleChange}
                          name="base_consumer_payout"
                        />
                      </Form.Group>
                    </Form.Row>
                  </>
                )}
                {values.commission_type === 'FLAT' && (
                  <>
                    <Form.Row>
                      <Col>
                        <Form.Label htmlFor="commission">
                          <b>Commission:</b>
                        </Form.Label>
                        <InputGroup>
                          <InputGroup.Prepend>
                            <InputGroup.Text>$</InputGroup.Text>
                          </InputGroup.Prepend>
                          <Form.Control
                            type="number"
                            defaultValue={values.commission_flat || 0}
                            name="commission_flat"
                            id="commission_flat"
                            aria-describedby="commission"
                            onChange={handleChange}
                            isInvalid={errors.commission_flat}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.commission_flat}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Col>
                      <Form.Group as={Col}>
                        <Form.Label>
                          <b>Consumer Payout:</b>
                        </Form.Label>
                        <Form.Control
                          disabled
                          plaintext
                          value={'$' + (values.commission_flat || 0)}
                          onChange={handleChange}
                          id="base_consumer_payout"
                          name="base_consumer_payout"
                          aria-describedby="base_consumer_payout"
                        />
                      </Form.Group>
                    </Form.Row>
                  </>
                )}
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

function Meta({ label, val, children }) {
  return (
    <Row className={styles.metaRow}>
      <Col sm={12} md={3} className={styles.metaLabel}>
        <p>{label}</p>
      </Col>
      <Col sm={12} md="auto" className={styles.metaVal}>
        <p>{children || val}</p>
      </Col>
    </Row>
  );
}

APModal.propTypes = {
  addNotification: PropTypes.func.isRequired,
};

export default connect(null, { addNotification })(APModal);
