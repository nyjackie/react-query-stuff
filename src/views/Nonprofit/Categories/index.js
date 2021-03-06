import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import {
  useInternalNpCategories,
  useUpdateInternalNpCategories,
  useInternalNonprofitsInCategory,
  useUpdateInternalNonprofitCategoryPriority,
} from 'hooks/useNonprofits';
import CategoriesList from 'components/Categories/CategoriesList';
import CategoryItems from 'components/Categories/CategoryItems';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import { setNotification } from 'actions/notifications';

const InternalNonprofitCategories = ({ setNotification }) => {
  const { isLoading, isError, data: categories } = useInternalNpCategories();
  const [setInternalNonprofitCategory] = useUpdateInternalNpCategories();
  const [setInternalNonprofitCategoryPriority] = useUpdateInternalNonprofitCategoryPriority();

  const [currentCat, setCurrentCat] = useState();
  const [catList, setCatList] = useState(null);
  useEffect(() => {
    if (categories) {
      const list = categories.sort((a, b) => (a.sort_order > b.sort_order ? 1 : -1));
      setCatList(list);
      setCurrentCat(list[0].id);
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

  const onCategorySave = async () => {
    try {
      for (let i = 0; i < catList.length; i++) {
        if (i + 1 !== catList[i].sort_order) {
          await saveNewOrder(i + 1, catList[i]);
        }
      }
      setNotification(`Category order updated`, 'success');
    } catch (err) {
      setNotification(`Category order update failed. Please try again later.`, 'error');
    }
  };
  const onNpSave = async (category_id, form) => {
    try {
      await setInternalNonprofitCategoryPriority({ category_id, body: form });
      setNotification(`Sort order updated`, 'success');
    } catch (err) {
      setNotification(`Sort order update failed. Please try again later.`, 'error');
    }
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
            <CategoryItems
              selected={currentCat}
              categoryItems={useInternalNonprofitsInCategory}
              location="np"
              categories={catList}
              onSave={onNpSave}
            />
          </div>
        </div>
      </Container>
    )
  );
};

export default connect(null, { setNotification })(InternalNonprofitCategories);
