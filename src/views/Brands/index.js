import React from 'react';
import { Col, Row, Table } from 'react-bootstrap';
import Brand from './Brand';
import styles from './Brands.module.scss';

const brands = [
  {
    id: 1,
    brand_category_id: 'Education',
    master_merchant_id: 143214312,
    logo_url: 'logo-url',
    hero_url: 'hero_url',
    name: 'random company',
    created_at: new Date(),
    modified_at: new Date(),
    is_disabled: false,
    is_groomed: false,
  },
  {
    id: 2,
    brand_category_id: 'Healthcare',
    master_merchant_id: 264326423,
    logo_url: 'logo-url',
    hero_url: 'hero_url',
    name: 'random company',
    created_at: new Date(),
    modified_at: new Date(),
    is_disabled: false,
    is_groomed: false,
  },
  {
    id: 3,
    brand_category_id: 'Fashion',
    master_merchant_id: 334254325,
    logo_url: 'logo-url',
    hero_url: 'hero_url',
    name: 'random company',
    created_at: new Date(),
    modified_at: new Date(),
    is_disabled: false,
    is_groomed: false,
  },
];

const Brands = () => {
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
