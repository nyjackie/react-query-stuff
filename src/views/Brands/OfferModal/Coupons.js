import React, { Fragment } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import { timeZoneName } from 'utils';
import { FieldArray, useFormikContext } from 'formik';

function emptyCoupon() {
  return {
    begins_at: '',
    code: '',
    description: '',
    ends_at: '',
  };
}

const TZHelpText = () => (
  <Form.Text className="text-muted">
    Select a time based on your local time zone: <b>{timeZoneName()}</b>
  </Form.Text>
);

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
         * ID or New
         */}
        {id ? (
          <Form.Group as={Col} xs={1} controlId={`coupon_${index}_id`}>
            <Form.Label>
              <b>ID:</b>
            </Form.Label>
            <Form.Control name={`${name}.id`} value={vals.id} readOnly plaintext />
          </Form.Group>
        ) : (
          <Col xs={1} className="d-flex flex-column justify-content-end pb-2">
            <p>
              <b>NEW</b>
            </p>
          </Col>
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
        <Form.Group as={Col} controlId={`coupon_${index}_beginAt`}>
          <Form.Label>
            <b>Start at:</b>
          </Form.Label>
          <Form.Control
            type="datetime-local"
            name={`${name}.begins_at`}
            onChange={handleChange}
            value={vals.begins_at || ''}
            isInvalid={!!err.begins_at}
          />
          <TZHelpText />
          <Form.Control.Feedback type="invalid">{err.begins_at}</Form.Control.Feedback>
        </Form.Group>

        {/***********************************************
         * Coupon End Date
         */}
        <Form.Group as={Col} controlId={`coupon_${index}_endsAt`}>
          <Form.Label>
            <b>End at:</b>
          </Form.Label>
          <Form.Control
            type="datetime-local"
            name={`${name}.ends_at`}
            value={vals.ends_at || ''}
            onChange={handleChange}
            isInvalid={!!err.ends_at}
          />
          <TZHelpText />
          <Form.Control.Feedback type="invalid">{err.ends_at}</Form.Control.Feedback>
        </Form.Group>
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
            {coupons.length === 0 && (
              <Button onClick={() => arrayHelpers.push(emptyCoupon())}>Add a coupon</Button>
            )}
            {coupons.length > 0 && (
              <ul className="list-unstyled">
                {coupons.map((c, i) => (
                  <li className="mb-1 mt-1" key={`id-${c.id}` || `index-${i}`}>
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
                <li>
                  <Button
                    className="mt-1"
                    title="add a new coupon"
                    onClick={() =>
                      arrayHelpers.insert(coupons.length > 0 ? coupons.length : 0, emptyCoupon())
                    }
                  >
                    Add new coupon
                  </Button>
                </li>
              </ul>
            )}
          </>
        )}
      />
    </Fragment>
  );
}

export default Coupons;
