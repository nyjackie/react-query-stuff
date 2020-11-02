import React, { Fragment } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import moment from 'moment';
import DateInput from 'components/DateInput';
import { FieldArray } from 'formik';

const emptyCoupon = {
  begins_at: '',
  code: '',
  description: '',
  ends_at: '',
};
const clone = obj => Object.assign({}, obj);

/**
 * A single Coupon
 */
function Coupon({ id, index, formik, name }) {
  const { values, handleChange, errors } = formik;
  const vals = values?.coupons[index];
  const err = errors?.coupons && errors?.coupons[index] ? errors?.coupons[index] : {};

  return (
    <Fragment>
      <Form.Row>
        {id && (
          <Col>
            <p>id: {id}</p>
          </Col>
        )}
        <Form.Group as={Col} controlId={`coupon_${index}_code`}>
          <Form.Label>
            <b>Code:</b>
          </Form.Label>
          <Form.Control
            name={`${name}.code`}
            value={vals.code}
            isInvalid={err.code}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">{err.code}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} controlId={`coupon_${index}_beginAt`}>
          <Form.Label>
            <b>Start Date:</b>
          </Form.Label>
          <DateInput
            name={`${name}.begins_at`}
            value={moment(vals.begins_at).format('yyyy-MM-DD')}
            onChange={handleChange}
            isInvalid={err.begins_at}
            errorMsg={err.begins_at}
          />
        </Form.Group>
        <Form.Group as={Col} controlId={`coupon_${index}_endsAt`}>
          <Form.Label>
            <b>End Date:</b>
          </Form.Label>
          <DateInput
            name={`${name}.ends_at`}
            value={moment(vals.ends_at).format('yyyy-MM-DD')}
            onChange={handleChange}
            isInvalid={err.ends_at}
            errorMsg={err.ends_at}
          />
        </Form.Group>
      </Form.Row>

      <Form.Row>
        <Form.Group as={Col} controlId={`coupon_${index}_description`}>
          <Form.Label>
            <b>Description:</b>
          </Form.Label>
          <Form.Control
            as="textarea"
            name={`${name}.description`}
            value={vals.description}
            isInvalid={err.description}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">{err.description}</Form.Control.Feedback>
        </Form.Group>
      </Form.Row>
    </Fragment>
  );
}

/**
 * Component for all coupons and actions around coupons
 */
function Coupons({ formik }) {
  const { values } = formik;

  return (
    <Fragment>
      <h3>Coupons</h3>
      {!values.coupons.length && <p>No coupons attached to this offer</p>}

      <FieldArray
        name="coupons"
        render={arrayHelpers => (
          <>
            {(!values.coupons || !values.coupons.length) && (
              <Button onClick={() => arrayHelpers.push(clone(emptyCoupon))}>Add a coupon</Button>
            )}
            {values.coupons.length > 0 && (
              <ul className="list-unstyled">
                {values.coupons.map((c, i) => (
                  <li className="mb-1 mt-1" key={c?.id || i}>
                    <Coupon name={`coupons[${i}]`} id={c.id} index={i} formik={formik} />
                    <Button className="mr-1 mt-1" onClick={() => arrayHelpers.remove(i)}>
                      -
                    </Button>
                    <Button
                      className="mt-1"
                      onClick={() => arrayHelpers.insert(i, clone(emptyCoupon))}
                    >
                      +
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      />
    </Fragment>
  );
}

export default Coupons;
