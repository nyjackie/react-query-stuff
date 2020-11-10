import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { useInternalNpCategories, useUpdateInternalNpCategories } from 'hooks/useNonprofits';
import CategoriesList from './CategoriesList';
import CategoryDetails from './CategoryDetails';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import { addNotification } from 'actions/notifications';

const InternalNonprofitCategories = ({ addNotification }) => {
  const { isLoading, isError, data: categories } = useInternalNpCategories();
  const [setInternalNonprofitCategory] = useUpdateInternalNpCategories();
  const [currentCat, setCurrentCat] = useState(1);
  const [catList, setCatList] = useState(null);
  useEffect(() => {
    if (categories) {
      const list = categories.sort((a, b) => (a.sort_order > b.sort_order ? 1 : -1));
      setCatList(list);
    }
  }, [categories, setCatList]);

  if (isLoading) {
    return (
      <Container className="block shadow-sm ">
        <div className={`d-flex justify-content-center align-items-center`}>
          <Spinner animation="border" />
        </div>
      </Container>
    );
  }
  if (!isLoading && isError) {
    return <Container className="block shadow-sm">Error Occurred. Try again later.</Container>;
  }
  const onCategorySave = () => {
    const promises = [];
    for (let i = 0; i < catList.length; i++) {
      if (i + 1 !== catList[i].sort_order) {
        promises.push(saveNewOrder(i + 1, catList[i]));
      }
    }
    Promise.all(promises)
      .then(() => {
        addNotification(`Category order updated`, 'success');
      })
      .catch(err => {
        addNotification(`Category order update failed. Please try again later.`, 'error');
      });
  };

  function saveNewOrder(i, item) {
    return new Promise(resolve => {
      const { hero_color, main_color, name, nonprofit_hero_color, id } = item;
      setInternalNonprofitCategory({
        id: id,
        body: {
          hero_color,
          main_color,
          name,
          nonprofit_hero_color,
          sort_order: i,
        },
      });
      resolve();
    });
  }

  return (
    !isLoading &&
    !isError &&
    catList && (
      <Container className="block shadow-sm " fluid>
        <Button onClick={onCategorySave}>Save Category Order</Button>
        <hr />
        <div className="row no-gutters">
          <div className="col-6">
            <CategoriesList
              categories={catList}
              setCatList={setCatList}
              setCat={e => setCurrentCat(e)}
            />
          </div>
          <div className="col-6">
            <CategoryDetails selected={currentCat} />
          </div>
        </div>
      </Container>
    )
  );
};

export default connect(null, { addNotification })(InternalNonprofitCategories);
