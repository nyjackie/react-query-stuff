import React from 'react';
import { Col, Row, Table } from 'react-bootstrap';
import Brand from './Brand';
import styles from './Brands.module.scss';
import { useBrands } from 'hooks/useBrands';
import Spinner from 'components/Spinner';

const Brands = () => {
  const { isLoading, isError, data: { brands } = {} } = useBrands();

  if (isLoading) {
    return <Spinner />;
  }
  if (isError) {
    return <div>Oooops something went wrong. Please try again later! </div>;
  }

  return (
    <Row>
      <Col>
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
  );
};

export default Brands;
