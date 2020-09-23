import React from 'react';
import PropTypes from 'prop-types';
import DateInput from 'components/DateInput';
import { Modal, Button, Form, Col, Row, InputGroup } from 'react-bootstrap';
import moment from 'moment';
import { Formik } from 'formik';
import { useUpdateOffer } from 'hooks/useBrands';
import {
  object as yupObject,
  number as yupNumber,
  string as yupString,
  boolean as yupBoolean,
} from 'yup';
import { connect } from 'react-redux';
import { addNotification } from 'actions/notifications';
import AsyncSelect from 'react-select/async';
import api from 'gdd-api-lib';
import { useNonprofit } from 'hooks/useNonprofits';

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
  commission_type: yupString().required('Commission Type cannot be empty.'),
  disclaimer: yupString().nullable(),
  is_disabled: yupBoolean().required('Visibility cannot be empty.'),
  is_groomed: yupBoolean().required('Groomed status cannot be empty.'),
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
    <Modal show={show} onHide={handleClose}>
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
              is_disabled: is_disabled === 'true',
              is_groomed: is_groomed === 'true',
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
                <Row className="form-row">
                  <Col className="form-col">
                    <p>
                      <b>Offer ID: </b>
                    </p>
                    <p>{offer.offer_guid}</p>
                  </Col>
                  <Col className="form-col">
                    <p>
                      <b>Offer Type: </b>
                    </p>
                    <p>{offer.offer_type}</p>
                  </Col>
                </Row>
                <Row className="form-col">
                  <Col className="form-col">
                    <p>
                      <b>Shop URL: </b>
                    </p>
                    <p>{offer.shop_url}</p>
                  </Col>
                </Row>
                <Row className="form-col">
                  <Col className="form-col">
                    <p>
                      <b>Affiliate Network Name: </b>
                    </p>
                    <p>{offer.affiliate_network_name}</p>
                  </Col>
                </Row>
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
                      onChange={e => {
                        values.supported_nonprofit_id = e.value;
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
                    <Form.Label>
                      <b>Commission Type:</b>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      value={values.commission_type ?? ''}
                      id="commission_type"
                      aria-describedby="commission_type"
                      onChange={handleChange}
                      isInvalid={!!errors.commission_type}
                    >
                      <option value="PERCENT">PERCENT</option>
                      <option value="FLAT">FLAT</option>
                    </Form.Control>
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
                    <Form.Label>
                      <b>Is Disabled:</b>
                    </Form.Label>
                    <Form.Control
                      custom
                      as="select"
                      name="is_disabled"
                      defaultValue={values.is_disabled}
                      aria-describedby="is_disabled"
                      onChange={handleChange}
                      isInvalid={!!errors.is_disabled}
                    >
                      <option value={true}>True</option>
                      <option value={false}>False</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.disclaimer}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>
                      <b>Groomed Status: </b>
                    </Form.Label>
                    <Form.Control
                      custom
                      as="select"
                      name="is_groomed"
                      defaultValue={values.is_groomed ?? ''}
                      aria-describedby="is_groomed"
                      onChange={handleChange}
                    >
                      <option value={true}>Complete</option>
                      <option value={false}>Incomplete</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.is_groomed}
                    </Form.Control.Feedback>
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

APModal.propTypes = {
  addNotification: PropTypes.func.isRequired,
};

export default connect(null, { addNotification })(APModal);
