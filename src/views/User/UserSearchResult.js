import React, { Fragment, useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';

const SingleResult = ({ result: { first_name, last_name, contact_phone, contact_email, created_at } }) => {
    // let history = useHistory();

    // function handleClick() {
    //   history.push(`/nonprofit/${result.ein}`);
    // }

    return (
        <tr className="pointer">
            <td>{first_name}</td>
            <td>{last_name}</td>
            <td>{contact_phone}</td>
            <td>{contact_email}</td>
            <td><Moment format="YYYY/MM/DD">{created_at}</Moment>
            </td>
        </tr>
    );
};

const UserSearchResult = ({ results }) => {
    if (!results || results.length === 0) {
        return null;
    }
    return (
        <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Phone#</th>
                    <th>Email</th>
                    <th>Accounted Created</th>
                </tr>
            </thead>
            <tbody>
                {results.map((item, i) => (
                    <SingleResult result={item} key={item.id} />
                ))}
            </tbody>
        </Table>
    );
};
const mapStateToProps = state => ({
    results: state.users.results,
});
export default connect(mapStateToProps, {})(UserSearchResult)
