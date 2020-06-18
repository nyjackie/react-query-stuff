import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row } from 'react-bootstrap';

const PageHeader = ({ pageTitle, className }) => {
  return (
    <Container>
      <Row>
        <section>
          <h1 className={className}>{pageTitle}</h1>
        </section>
      </Row>
    </Container>
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
