import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Table } from 'react-bootstrap';
import { getBanned } from 'actions/banned';
import PageHeader from 'components/PageHeader';

const BannedRow = ({ data }) => {
  const { ein, name, bannedBy, bannedReason } = data;
  return (
    <tr>
      <td>{ein}</td>
      <td>{name}</td>
      <td>{bannedBy}</td>
      <td>{bannedReason}</td>
    </tr>
  );
};

function Banlist({ list, getBanned }) {
  useEffect(() => {
    getBanned().catch(err => {
      console.error('error getting banned', err);
    });
  }, [getBanned]);

  console.log(list);

  return (
    <Fragment>
      <PageHeader pageTitle="Banlist" />
      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ein</th>
                <th>Name</th>
                <th>Banned by</th>
                <th>Ban reason</th>
              </tr>
            </thead>
            <tbody>
              {list.map(row => (
                <BannedRow key={row.id} data={row} />
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Fragment>
  );
}

const mapStateToProps = state => ({
  list: state.banned.list,
});

export default connect(mapStateToProps, { getBanned })(Banlist);
