import React, { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from './Categories.module.scss';
import PropTypes from 'prop-types';
import CategoryItem from './CategoryItem';
import { Paginator } from 'gdd-components';

const BrandItems = ({ id, name, brand_category_priority, onSave, category_id }) => {
  const [formData, setFormData] = useState({
    brand_id: id,
    priority_order: brand_category_priority,
  });
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = e => {
    e.preventDefault();
    onSave(category_id, formData);
  };
  return (
    <Card className={styles.nonprofitItem}>
      <Card.Header>
        <Form onSubmit={onSubmit}>
          <Row>
            <Col xs={4}>
              <div>
                <p>{name}</p>
              </div>
            </Col>
            <Col xs={5}>
              <Form.Group controlId="Category">
                <Form.Label>Sort Order:</Form.Label>
                <Form.Control
                  defaultValue={brand_category_priority}
                  name="priority_order"
                  onChange={onChange}
                  type="number"
                />
              </Form.Group>
            </Col>
            <Col xs={3} className="d-flex justify-content-center align-items-center">
              <Button
                disabled={+formData.brand_category_priority === brand_category_priority}
                type="submit"
              >
                Update
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Header>
    </Card>
  );
};

const NPItems = ({ id, name, priority, categories, onSave }) => {
  return (
    <Accordion className={styles.nonprofitItem}>
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
            <CategoryItem
              items={priority}
              nonprofit_id={id}
              categories={categories}
              onSave={onSave}
            />
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};

const CategoryItems = ({ selected, categoryItems, categories, onSave, location }) => {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(0);
  useEffect(() => {
    setOffset(0);
  }, [selected, setOffset]);

  const { resolvedData: items, latestData, isError, isLoading, isFetching } = categoryItems(
    selected,
    offset
  );
  useEffect(() => {
    if (latestData) {
      setLimit(latestData?.total_results || 50);
    }
  }, [latestData]);

  if (isError || !selected) {
    return <div className={styles.nonprofitList}>Please select a Category.</div>;
  }

  if (isLoading || isFetching) {
    return (
      <div className={`d-flex ${styles.nonprofitList} justify-content-center align-items-center`}>
        <Spinner animation="border" variant="light" className={styles.spinner} />
      </div>
    );
  }

  if (!isLoading && items?.total_results === 0) {
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
    items && (
      <div className={styles.nonprofitList}>
        {location === 'np' &&
          items.nonprofits.map(item => {
            const { id, name, priority } = item;
            return (
              <NPItems
                key={id}
                id={id}
                name={name}
                priority={priority}
                categories={categories}
                onSave={onSave}
              />
            );
          })}
        {location === 'brands' &&
          items.brands.map(item => {
            const { id, name, brand_category_priority } = item;
            return (
              <BrandItems
                category_id={selected}
                id={id}
                name={name}
                brand_category_priority={brand_category_priority}
                key={id}
                onSave={onSave}
              />
            );
          })}
        <Paginator
          total={latestData?.total_results || limit}
          offset={offset}
          limit={8}
          onPage={newOffset => {
            setOffset(newOffset);
          }}
        />
      </div>
    )
  );
};

CategoryItems.propTypes = {
  selected: PropTypes.number.isRequired,
  location: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  categoryItems: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
};

export default CategoryItems;
