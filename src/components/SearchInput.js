import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { object as yupObject, string as yupString } from 'yup';
import { getSearchQuery } from 'utils';

const schema = yupObject({
  searchTerm: yupString()
    .max(250, 'search term is too long (max: 250)')
    .required('Please enter a search query'),
});

const SearchInput = ({ history, location, label }) => {
  const query = getSearchQuery('query');

  const formik = useFormik({
    validationSchema: schema,
    initialValues: {
      searchTerm: query,
    },
    onSubmit: values => {
      if (values.searchTerm) {
        const param = new URLSearchParams({ query: values.searchTerm.trim() });
        history.push(`${location.pathname}?${param.toString()}`);
      }
    },
  });

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <Form.Group controlId="searchForm">
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type="searcb"
          name="searchTerm"
          onChange={formik.handleChange}
          value={formik.values.searchTerm}
          isInvalid={formik.touched.searchTerm && formik.errors.searchTerm}
          isValid={formik.touched.searchTerm && !formik.errors.searchTerm}
        />
        <Form.Control.Feedback type="invalid">{formik.errors.searchTerm}</Form.Control.Feedback>
      </Form.Group>
      <Button type="submit" value="Search">
        Search
      </Button>
    </Form>
  );
};

export default SearchInput;
