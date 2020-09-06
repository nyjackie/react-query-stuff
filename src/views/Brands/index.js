import React, { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Brand from './Brand';
import styles from './Brands.module.scss';
import { useBrands } from 'hooks/useBrands';
import Spinner from 'components/Spinner';
import { Paginator } from 'gdd-components';

const Brands = () => {
  const [offset, setOffset] = useState(0);
  const { resolvedData: { brands = [] } = {}, latestData, isError, isLoading } = useBrands(offset);

  if (isLoading) {
    return <Spinner />;
  }
  if (isError) {
    return <div>Oooops something went wrong. Please try again later! </div>;
  }

  return (
    <Container className="block shadow-sm">
      <Row>
        <Col>
          <h2>Brands Grooming Queue</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className={styles.tableDate}>Date</th>
                <th className={styles.tableBrand}>Brand</th>
                <th className={styles.tableAction}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map(brand => (
                <Brand key={brand.id} brand={brand} />
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-center">
          {/* TODO: replace 500 with "total_results" */}
          <Paginator
            total={latestData?.total_results || 500}
            offset={0}
            onPage={newOffset => {
              setOffset(newOffset);
            }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Brands;
