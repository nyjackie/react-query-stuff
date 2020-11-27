import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import styles from './index.module.scss';

function getRange(currentPage, limit, total) {
  let resultEnd = currentPage * limit;
  let resultBegin = resultEnd - limit;

  if (resultEnd > total) {
    // since our "limit" prop enforces numbers that are multiples of 10, we can
    // just use total/10 here to get the accurate remaining results
    resultEnd = resultBegin + Number(String(total / 10).split('.')[1]);
  }
  return [resultBegin, resultEnd];
}

function BasicPaginator({ total, limit = 10, offset = 0, onSelect }) {
  // starting page is calculated from initially passed offset
  // Offset starts at zero but page numbers should be user-friendly so they
  // start at 1
  const [currentPage, setCurrentPage] = useState(offset / limit + 1);

  function doPageChange(num) {
    setCurrentPage(num);
    const [rangeStart] = getRange(num, limit, total);
    onSelect(rangeStart);
  }

  function handlePageChange(e) {
    const val = Number(e.currentTarget.value);
    doPageChange(val);
  }

  if (total < limit) {
    return (
      <p>
        <b>Viewing results</b>: 1 - {total} out of {total}
      </p>
    );
  }

  const pages = Math.ceil(total / limit);
  const [resultBegin, resultEnd] = getRange(currentPage, limit, total);

  return (
    <div className={styles.paginator}>
      <p>
        <b>Viewing results</b>: {resultBegin + 1} - {resultEnd} out of {total}
      </p>

      <div className={styles.container}>
        <button
          className={styles.prev}
          disabled={currentPage === 1}
          onClick={() => {
            doPageChange(currentPage - 1);
          }}
        >
          &laquo; Prev
        </button>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text id="claim-queue-page">Page</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control as="select" onChange={handlePageChange} defaultValue={currentPage}>
            {Array(pages)
              .fill(0)
              .map((_, i) => {
                const val = i + 1;
                return (
                  <option key={`basicPaginator-page-${i}`} value={val}>
                    {val}
                  </option>
                );
              })}
          </Form.Control>
        </InputGroup>
        <button
          className={styles.next}
          disabled={currentPage === Math.ceil(total / limit)}
          onClick={() => {
            doPageChange(currentPage + 1);
          }}
        >
          Next &raquo;
        </button>
      </div>
    </div>
  );
}

BasicPaginator.propTypes = {
  total: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  offset: PropTypes.number,

  /**
   * Just to make my life easier the limit should always be a multiple of 10
   * it makes the calculations in the compoment a lot simpler
   */
  limit: function (props, propName, componentName) {
    const prop = props[propName];
    if (typeof prop !== 'number') {
      return new Error(
        `Invalid value for "${propName}" prop supplied to ${componentName}. 
         Expected a number but got a ${typeof prop} instead`
      );
    }
    if (prop % 10 !== 0) {
      return new Error(
        `Invalid prop ${propName} supplied to ${componentName}. The number should be a multiple of 10`
      );
    }
  },
};

export default BasicPaginator;
