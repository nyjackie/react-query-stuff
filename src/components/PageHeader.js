import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container, Row } from 'react-bootstrap';

const PageHeader = ({ pageTitle, hideBack, className }) => {
  return (
    <Container>
      <Row>
        <section>
          <h1 className={className}>{pageTitle}</h1>
          {!hideBack && (
            <p>
              <Link to="/">Back</Link>
            </p>
          )}
        </section>
      </Row>
    </Container>
  );
};

PageHeader.defaultProps = {
  hideBack: false,
  className: '',
};

PageHeader.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  hideBack: PropTypes.bool,
  className: PropTypes.string,
};

export default PageHeader;
