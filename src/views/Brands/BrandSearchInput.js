import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { createSchema, max255 } from 'utils/schema';
import { getSearchQuery } from 'utils';

const schema = createSchema({
  search_term: max255.required().min(2, 'please enter more than one character'),
});

const SearchInput = ({ history, location, limit, offset }) => {
  const query = getSearchQuery();

  const formik = useFormik({
    validationSchema: schema,
    initialValues: {
      search_term: query.search_term || '',
    },
    onSubmit: ({ search_term }) => {
      if (search_term && search_term.length > 1) {
        const param = new URLSearchParams({ search_term, limit, offset });
        history.push(`${location.pathname}?${param.toString()}`);
      }
    },
  });

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <Form.Group controlId="searchNp">
        <Form.Label>Search Brands</Form.Label>
        <Form.Control
          type="search"
          name="search_term"
          autoFocus
          onChange={formik.handleChange}
          value={formik.values.search_term}
          isInvalid={formik.touched.search_term && formik.errors.search_term}
        />
        <Form.Control.Feedback type="invalid">{formik.errors.search_term}</Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" value="Search">
        Search
      </Button>
    </Form>
  );
};

export default SearchInput;
