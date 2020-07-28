import React, { Fragment } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import PageHeader from 'components/PageHeader';
import { useBanned } from 'hooks/useBanned';
import Spinner from 'components/Spinner';

function BannedRow({ data }) {
  const { ein, name, bannedBy, bannedReason } = data;
  return (
    <tr>
      <td>{ein}</td>
      <td>{name}</td>
      <td>{bannedBy}</td>
      <td>{bannedReason}</td>
    </tr>
  );
}

function Banlist() {
  const { isLoading, isError, data, error } = useBanned();

  if (isLoading) {
    return <Spinner fullPage={true} />;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

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
              {data.map(row => (
                <BannedRow key={row.id} data={row} />
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Fragment>
  );
}

export default Banlist;
