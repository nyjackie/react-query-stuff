import React, { Fragment, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PropTypes from 'prop-types';

const Item = ({ item: { category_id, priority_order }, nonprofit_id, eol, categories, onSave }) => {
  const [category, setCategory] = useState('');
  const [formData, setFormData] = useState({
    nonprofit_id: nonprofit_id,
    priority_order: priority_order,
  });
  useEffect(() => {
    const cat = categories?.find(cat => cat.id === category_id)?.name;
    setCategory(cat || '');
  }, [categories, category_id]);
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = e => {
    e.preventDefault();
    onSave(category_id, formData);
  };
  return (
    <Fragment>
      <Form onSubmit={onSubmit}>
        <Row>
          <Col>
            <div>
              <p>Category:</p>
              <p>{category}</p>
            </div>
          </Col>
          <Col xs>
            <Form.Group controlId="Category">
              <Form.Label>Sort Order:</Form.Label>
              <Form.Control
                defaultValue={priority_order}
                name="priority_order"
                onChange={onChange}
                type="number"
              />
            </Form.Group>
          </Col>
          <Col xs="auto" className="d-flex justify-content-center align-items-center">
            <Button disabled={+formData.priority_order === priority_order} type="submit">
              Update
            </Button>
          </Col>
        </Row>
      </Form>
      {eol && <hr />}
    </Fragment>
  );
};
const CategoryItem = ({ items, nonprofit_id, categories, onSave }) => {
  return (
    <Fragment>
      {items.map((item, i) => (
        <Item
          item={item}
          key={i}
          eol={!(i === items.length - 1)}
          nonprofit_id={nonprofit_id}
          onSave={onSave}
          categories={categories}
        />
      ))}
    </Fragment>
  );
};

CategoryItem.propTypes = {
  onSave: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  nonprofit_id: PropTypes.number,
};

export default CategoryItem;
