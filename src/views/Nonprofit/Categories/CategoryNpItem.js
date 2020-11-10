import React, { Fragment, useEffect, useState } from 'react';
import { useNpCategories, useUpdateInternalNonprofitCategoryPriority } from 'hooks/useNonprofits';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { connect } from 'react-redux';
import { addNotification } from 'actions/notifications';
import PropTypes from 'prop-types';

const CategoryItem = ({ item: { category_id, priority_order }, nonprofit_id, eol, submitForm }) => {
  const { data: npCat } = useNpCategories();
  const [category, setCategory] = useState('');
  const [formData, setFormData] = useState({
    nonprofit_id: nonprofit_id,
    priority_order: priority_order,
  });
  useEffect(() => {
    const cat = npCat?.find(cat => cat.id === category_id).name;
    setCategory(cat || '');
  }, [npCat, category_id]);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    submitForm(category_id, formData);
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
const CategoryNpItem = ({ items, nonprofit_id, addNotification }) => {
  const [setInternalNonprofitCategoryPriority] = useUpdateInternalNonprofitCategoryPriority();
  const submitForm = (category_id, form) => {
    setInternalNonprofitCategoryPriority({ category_id, body: form })
      .then(() => {
        addNotification(`Sort order updated`, 'success');
      })
      .catch(err => {
        addNotification(`Sort order update failed. Please try again later.`, 'error');
      });
  };
  return (
    <Fragment>
      {items.map((item, i) => (
        <CategoryItem
          item={item}
          key={i}
          eol={!(i === items.length - 1)}
          nonprofit_id={nonprofit_id}
          submitForm={submitForm}
        />
      ))}
    </Fragment>
  );
};

CategoryNpItem.propTypes = {
  addNotification: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  nonprofit_id: PropTypes.number.isRequired,
};

export default connect(null, { addNotification })(CategoryNpItem);
