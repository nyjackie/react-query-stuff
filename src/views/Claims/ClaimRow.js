import React from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ClaimInfo from 'components/ClaimInfo';

const ClaimRow = ({ npo }) => {
  return (
    <li className="block shadow-sm">
      <Row className="align-items-end">
        <Col className="d-flex justify-content-between">
          <h3>{npo.name}</h3>
        </Col>
      </Row>
      <ClaimInfo npo={npo} />
    </li>
  );
};

ClaimRow.propTypes = {
  npo: PropTypes.object.isRequired,
};

export default ClaimRow;
