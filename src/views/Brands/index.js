import React, { Fragment, useState } from 'react';
import { Col, Row, Table, Pagination } from 'react-bootstrap';
import Brand from './Brand';
import styles from './Brands.module.scss';
import { useBrands } from 'hooks/useBrands';
import Spinner from 'components/Spinner';

const Brands = () => {
  const [page, setPage] = useState(1);
  const { resolvedData: { brands = [] } = {}, latestData, isError, isLoading } = useBrands(
    page - 1
  );
  const prevPage = () => {
    setPage(page => Math.max(page - 1, 1));
  };

  const nextPage = () => {
    setPage(page => (!latestData || latestData.brands.length === 0 ? page : page + 1));
  };
  if (isLoading) {
    return <Spinner />;
  }
  if (isError) {
    return <div>Oooops something went wrong. Please try again later! </div>;
  }

  return (
    <Fragment>
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
      <Row>
        <Col className="d-flex justify-content-center">
          <Pagination>
            <Pagination.Prev onClick={() => prevPage()} disabled={page === 1} />
            <Pagination.Item>{page}</Pagination.Item>
            <Pagination.Next
              onClick={() => nextPage()}
              disabled={!latestData || latestData.brands.length === 0}
            />
          </Pagination>
        </Col>
      </Row>
    </Fragment>
  );
};

export default Brands;
