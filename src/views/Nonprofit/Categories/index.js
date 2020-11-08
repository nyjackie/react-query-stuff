import React from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import { useInternalNpCategories } from 'hooks/useNonprofits';
import { getInternalBrandCategory, Row, Col } from 'gdd-api-lib/dist/lib';
import CategoriesList from './CategoriesList';
import styles from './InternalNonprofitCategories.module.scss';
const InternalNonprofitCategories = () => {
  const { isLoading, isError, data: categories } = useInternalNpCategories();
  return (
    !isLoading &&
    !isError && (
      <Container className="block shadow-sm d-flex ">
        <div className="row">
          <div className="col-6">
            <CategoriesList categories={categories} />
          </div>
          <div className="col-6">hello</div>
        </div>
      </Container>
    )
  );
};

export default InternalNonprofitCategories;
