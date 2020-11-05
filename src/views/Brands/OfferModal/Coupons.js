import React, { Fragment } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import { FieldArray, useFormikContext } from 'formik';
import DateTimeET from 'components/DateTimeET';
import styles from './OfferEditModal.module.scss';

function emptyCoupon() {
  return {
    begins_at: '',
    code: '',
    description: '',
    ends_at: '',
  };
}

/**
 * A single Coupon
 */
function Coupon({ id, index, name }) {
  const { values, handleChange, errors } = useFormikContext();
  const vals = values?.coupons[index];
  const err = errors?.coupons && errors?.coupons[index] ? errors?.coupons[index] : {};

  return (
    <Fragment>
      <Form.Row>
        {/***********************************************
         * ID if it exists
         */}
        {id && (
          <Form.Group as={Col} xs={1} controlId={`coupon_${index}_id`}>
            <Form.Label>
              <b>ID:</b>
            </Form.Label>
            <Form.Control name={`${name}.id`} value={vals.id} readOnly plaintext />
          </Form.Group>
        )}

        {/***********************************************
         * Coupon Code
         */}
        <Form.Group as={Col} controlId={`coupon_${index}_code`}>
          <Form.Label>
            <b>Code:</b>
          </Form.Label>
          <Form.Control
            name={`${name}.code`}
            value={vals.code}
            isInvalid={!!err.code}
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">{err.code}</Form.Control.Feedback>
        </Form.Group>

        {/***********************************************
         * Coupon Start Date
         */}
        <Col>
          <DateTimeET
            controlId={`coupon_${index}_beginAt`}
            label={
              <Form.Label>
                <b>Begins:</b>
              </Form.Label>
            }
            name={`${name}.begins_at`}
            onChange={handleChange}
            value={vals.begins_at}
            isInvalid={!!err.begins_at}
            feedback={<Form.Control.Feedback type="invalid">{err.begins_at}</Form.Control.Feedback>}
          />
        </Col>
        {/***********************************************
         * Coupon End Date
         */}
        <Col>
          <DateTimeET
            controlId={`coupon_${index}_endsAt`}
            label={
              <Form.Label>
                <b>Ends:</b>
              </Form.Label>
            }
            name={`${name}.ends_at`}
            value={vals.ends_at}
            onChange={handleChange}
            isInvalid={!!err.ends_at}
            feedback={<Form.Control.Feedback type="invalid">{err.ends_at}</Form.Control.Feedback>}
          />
        </Col>
      </Form.Row>
      {/***********************************************
       * Coupon Description
       */}
      <Form.Row>
        <Form.Group as={Col} controlId={`coupon_${index}_description`}>
          <Form.Label>
            <b>Description:</b>
          </Form.Label>
          <Form.Control
            as="textarea"
            name={`${name}.description`}
            value={vals.description}
            isInvalid={!!err.description}
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
function Coupons({ coupons = [] }) {
  return (
    <Fragment>
      <h3 className="h4 mt-4">Coupons</h3>
      {!coupons.length && <p>No coupons attached to this offer</p>}

      <FieldArray
        name="coupons"
        render={arrayHelpers => (
          <>
            {coupons.length > 0 && (
              <ul className={`${styles.couponList} list-unstyled`}>
                {coupons.map((c, i) => (
                  <li key={c.id ? `id-${c.id}` : `index-${i}`}>
                    <Form.Row>
                      <Col>
                        <Coupon name={`coupons[${i}]`} id={c.id} index={i} />
                      </Col>
                      <Col md="2" className="flex-center-center">
                        <div>
                          <Button
                            variant="danger"
                            className="mr-1 mt-1"
                            onClick={() => arrayHelpers.remove(i)}
                          >
                            delete coupon
                          </Button>
                        </div>
                      </Col>
                    </Form.Row>
                  </li>
                ))}
              </ul>
            )}
            <Button onClick={() => arrayHelpers.push(emptyCoupon())}>Add a coupon</Button>
          </>
        )}
      />
    </Fragment>
  );
}

export default Coupons;
