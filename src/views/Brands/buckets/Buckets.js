import React from 'react';
import { useBuckets } from 'hooks/useBrands';
import { Container, Row, Col, Table } from 'react-bootstrap';

const Buckets = () => {
  const { isLoading, isError, data } = useBuckets();
  return (
    !isLoading &&
    !isError &&
    data && (
      <Container className="block shadow-sm">
        <Row>
          <Col>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Type</th>
                  <th>Title</th>
                </tr>
              </thead>

              <tbody>
                {data.buckets.map(bucket => {
                  return (
                    <tr key={bucket.id}>
                      <td>{bucket.id}</td>
                      <td>{bucket.presentation_type}</td>
                      <td>{bucket.title}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    )
  );
};

export default Buckets;
