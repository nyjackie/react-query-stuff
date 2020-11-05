import React, { Fragment } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import { useFormikContext } from 'formik';

function Commission() {
  const { values, handleChange, errors } = useFormikContext();

  return (
    <Fragment>
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
          <Form.Control.Feedback type="invalid">{errors.commission_type}</Form.Control.Feedback>
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
    </Fragment>
  );
}

export default Commission;
