import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import moment from 'moment'

import {
    Modal,
    Button,
    InputGroup,
    FormControl,
    Col,
    Row,
    Container,
    Jumbotron,
    Form
} from 'react-bootstrap';
import PageHeader from 'components/PageHeader';
import { connect } from 'react-redux';
import { getUser } from 'actions/user';
import styles from './User.module.scss'

const initialState = {
    first_name: '',
    last_name: '',
    contact_email: '',
    contact_phone: '',
    profile_status: {
        status: '',
        description: ''
    },
    created_at: '',
    modified_at: ''

};

const UserInfo = ({
    getUser,
    match,
    user,
}) => {
    useEffect(() => {
        getUser(match.params.id);
    }, [getUser, match.params.id]);
    const [edit, toggleEdit] = useState(true);
    const [formData, setFormData] = useState(initialState);
    const {
        first_name,
        last_name,
        contact_email,
        contact_phone,
        profile_status: { status, description },
        created_at,
        modified_at
    } = formData;

    return user === null ? (
        <div>Loading...</div>
    ) : (
            <Fragment>
                <Jumbotron className={styles.jumbotron}>
                    <Button onClick={() => { toggleEdit(!edit) }} className={styles.edit}>
                        Edit
                </Button>
                    <Form >
                        <Form.Row>
                            <Col sm={6}>
                            <Form.Group as={Row} controlId="first_name" >
                                <Form.Label column sm="2">Created at: </Form.Label>
                                <Col sm="5" >
                                    {/* <Moment className={styles.date} format="YYYY/MM/DD">{user.created_at}</Moment> */}
                                    <Form.Control plaintext readOnly value={moment(user.created_at).format('MM/DD/YYYY')}/>
                                </Col>
                            </Form.Group>
                            </Col >
                            <Col sm={6}>
                            <Form.Group as={Row} controlId="modified_at">
                                <Form.Label column sm="2">Modified at: </Form.Label>
                                <Col sm="5" >
                                <Form.Control plaintext readOnly value={moment(user.modified_at).format('MM/DD/YYYY')}/>
                                </Col>
                            </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col sm={6}>
                            <Form.Group as={Row} controlId="first_name" >
                                <Form.Label column sm="2">First Name: </Form.Label>
                                <Col sm="9">
                                <Form.Control plaintext={edit} readOnly={edit} type="name" value={user.first_name} />
                                </Col>
                            </Form.Group>
                            </Col>
                            <Col sm={6}>
                            <Form.Group as={Row} controlId="last_name">
                                <Form.Label column sm="2">Last Name: </Form.Label>
                                <Col sm="9">
                                <Form.Control plaintext={edit} readOnly={edit} type="name" value={user.last_name} />
                                </Col>
                            </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col sm={6}>
                            <Form.Group as={Row} controlId="email" >
                                <Form.Label column sm="2">Email: </Form.Label>
                                <Col sm="9">
                                <Form.Control plaintext={edit} readOnly={edit} type="email" value={user.contact_email} />
                                </Col>
                            </Form.Group>
                            </Col>
                            <Col sm={6}>
                            <Form.Group as={Row} controlId="phone">
                                <Form.Label column sm="2">Phone#: </Form.Label>
                                <Col sm="9">
                                <Form.Control plaintext={edit} readOnly={edit} type="phone" value={user.contact_phone} />
                                </Col>
                            </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col sm={12}>
                            <Form.Group as={Row} controlId="formGridStatus">
                                <Form.Label column sm="1">Status: </Form.Label>
                                <Col sm="3">
                                <Form.Control plaintext={edit} readOnly={edit} disabled={edit} as="select" defaultValue={user.profile_status.status}>
                                    <option>active</option>
                                    <option>inactive</option>
                                </Form.Control>
                                </Col>
                            </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                        <Col sm={12}>
                            <Form.Group as={Row} controlId="formGridStatus">
                                <Form.Label column sm="1">Description: </Form.Label>
                                <Col sm="8">
                                <Form.Control rows="3" plaintext={edit} readOnly={edit} disabled={edit} as="textarea" defaultValue={user.profile_status.description} />
                                </Col>
                            </Form.Group>
                            </Col>
                        </Form.Row>
                        {!edit && (<Button type="submit">Submit</Button>)}
                    </Form>
                </Jumbotron>
            </Fragment>
        )
}

UserInfo.propTypes = {
    addNotification: PropTypes.func.isRequired,
    getUser: PropTypes.func.isRequired,
    selected: PropTypes.object.isRequired,
};


const mapStateToProps = state => ({
    user: state.users.selected,
});

export default connect(mapStateToProps, { getUser })(UserInfo)