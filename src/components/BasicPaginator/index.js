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

// eslint-disable-next-line no-unused-vars
function LimitSelect({ limit, onChange }) {
  return (
    <InputGroup className={styles.limit}>
      <InputGroup.Prepend>
        <InputGroup.Text id="claim-queue-page">Results per page</InputGroup.Text>
      </InputGroup.Prepend>
      <Form.Control as="select" onChange={onChange} defaultValue={limit}>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        <option value="40">40</option>
        <option value="50">50</option>
        <option value="60">60</option>
        <option value="70">70</option>
        <option value="80">80</option>
        <option value="90">90</option>
        <option value="100">100</option>
      </Form.Control>
    </InputGroup>
  );
}

function BasicPaginator({ total, limit = 10, offset = 0, onPageChange, onLimitChange }) {
  // starting page is calculated from initially passed offset
  // Offset starts at zero but page numbers should be user-friendly so they
  // start at 1
  const [currentPage, setCurrentPage] = useState(offset / limit + 1);

  function doPageChange(num) {
    setCurrentPage(num);
    const [rangeStart] = getRange(num, limit, total);
    onPageChange(rangeStart);
  }

  /**
   * handles the page select event
   * @param {Event} e
   */
  function handlePageChange(e) {
    const val = Number(e.currentTarget.value);
    doPageChange(val);
  }

  if (total < limit + 1) {
    return (
      <div>
        <p>
          <b>Viewing results</b>: 1 - {total} out of {total}
        </p>
        <LimitSelect
          limit={limit}
          onChange={e => {
            onLimitChange(e.target.value);
          }}
        />
      </div>
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
        <LimitSelect
          limit={limit}
          onChange={e => {
            onLimitChange(e.target.value);
          }}
        />

        <button
          className={styles.prev}
          disabled={currentPage === 1}
          onClick={() => {
            doPageChange(currentPage - 1);
          }}
        >
          &laquo; Prev
        </button>
        <InputGroup className={styles.page}>
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
  onPageChange: PropTypes.func.isRequired,
  onLimitChange: PropTypes.func.isRequired,
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
