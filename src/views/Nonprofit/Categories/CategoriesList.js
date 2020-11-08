import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

const CategoriesList = ({ categories }) => {
  return (
    <ListGroup defaultActiveKey="cat0">
      {categories.map((category, i) => (
        <ListGroup.Item action key={category.id} as="button" href={`cat${i}`}>
          <p>{category.sort_order}</p>
          <p>{category.hero_color}</p>
          <p>{category.has_nonprofits}</p>
          <p>{category.logo_url}</p>
          <p>{category.main_color}</p>
          <p>{category.name}</p>
          <p>{category.nonprofit_hero_color}</p>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default CategoriesList;
