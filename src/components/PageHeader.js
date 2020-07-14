import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'react-bootstrap';

const PageHeader = ({ pageTitle, className }) => {
  return (
    <Row>
      <section>
        <h2 className={className}>{pageTitle}</h2>
      </section>
    </Row>
  );
};

PageHeader.defaultProps = {
  className: '',
};

PageHeader.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default PageHeader;
