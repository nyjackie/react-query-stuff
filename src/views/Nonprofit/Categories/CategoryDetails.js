import React from 'react';
import { useInternalNonprofitsInCategory } from 'hooks/useNonprofits';
import CategoryNpItem from './CategoryNpItem';
import Spinner from 'react-bootstrap/Spinner';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import styles from './InternalNonprofitCategories.module.scss';
import PropTypes from 'prop-types';

const CategoryDetails = ({ selected }) => {
  const { isLoading, isError, data: categoryList } = useInternalNonprofitsInCategory(selected);
  if (isError || !selected) {
    return <div className={styles.nonprofitList}>Please select a Category.</div>;
  }
  if (isLoading) {
    return (
      <div className={`d-flex ${styles.nonprofitList} justify-content-center align-items-center`}>
        <Spinner animation="border" variant="light" className={styles.spinner} />
      </div>
    );
  }
  if (!isLoading && categoryList?.total_results === 0) {
    return (
      <div
        className={`d-flex ${styles.nonprofitList} justify-content-center align-items-center text-light`}
      >
        <figure className="text-center">
          <img src="https://imgflip.com/s/meme/Doge.jpg" alt="empty" className={styles.icon} />
          <figcaption>Wow. such empty</figcaption>
        </figure>
      </div>
    );
  }
  return (
    !isLoading &&
    !isError &&
    categoryList && (
      <div className={styles.nonprofitList}>
        {categoryList.nonprofits.map(item => {
          const { id, name, priority } = item;
          return (
            <Accordion key={id} className={styles.nonprofitItem}>
              <Card>
                <Card.Header className="d-flex">
                  <Accordion.Toggle
                    as={Button}
                    variant="light"
                    eventKey="0"
                    className="text-left flex-fill"
                  >
                    {name}
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <CategoryNpItem items={priority} nonprofit_id={id} />
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          );
        })}
      </div>
    )
  );
};

CategoryDetails.propTypes = {
  selected: PropTypes.number.isRequired,
};

export default CategoryDetails;
