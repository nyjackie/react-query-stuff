import React, { useCallback } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import styles from './Categories.module.scss';

const CategoryItem = ({ item, index, setCat }) => (
  <Draggable draggableId={`${item.id}`} index={index}>
    {provided => {
      return (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <ListGroup.Item
            action
            as="div"
            href={`cat${item.sort_order}`}
            onClick={() => setCat(item.id)}
            className="d-flex align-items-center"
          >
            {item.logo_url && (
              <img src={item.logo_url} alt="category_logo" className={styles.icon} />
            )}
            <h4>{item.name}</h4>
          </ListGroup.Item>
        </div>
      );
    }}
  </Draggable>
);

const CategoryMenu = React.memo(function CategoryMenu({ items, setCat }) {
  return (
    <ListGroup defaultActiveKey="cat1">
      {items.map((item, i) => (
        <CategoryItem item={item} index={i} key={item.id} setCat={setCat} />
      ))}
    </ListGroup>
  );
});

const CategoriesList = ({ categories, setCat, setCatList }) => {
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  const onChange = useCallback(
    e => {
      setCatList(e);
    },
    [setCatList]
  );

  const onDragEnd = result => {
    if (!result.destination) {
      return;
    }
    const _items = reorder(categories, result.source.index, result.destination.index);
    onChange(_items);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <CategoryMenu items={categories} setCat={setCat} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

CategoryItem.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  setCat: PropTypes.func.isRequired,
};

export default CategoriesList;
