import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment'

import {
    Modal,
    Button,
    Col,
    Row,
    Jumbotron,
    Form
} from 'react-bootstrap';
import PageHeader from 'components/PageHeader';
import { connect } from 'react-redux';
import { getUser } from 'actions/user';
import styles from './User.module.scss'
import { addNotification } from 'actions/notifications';

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

const UserInfo = ({ getUser, match, user: { selected }, addNotification }) => {
    const [show, setShow] = useState(false);
    const [edit, toggleEdit] = useState(true);
    const [formData, setFormData] = useState(initialState);


    useEffect(() => {
        getUser(match.params.id);
    }, [getUser, match.params.id]);

    useEffect(() => {
        const userData = { ...initialState };
        for (const el in selected) {
            if (el in userData) userData[el] = selected[el];
        }
        setFormData(userData)
    }, [selected])


    const {
        first_name,
        last_name,
        contact_email,
        contact_phone,
        profile_status: { status, description },
        created_at,
        modified_at
    } = formData;

    const onChange = e => {
        if (e.target.name === "status" || e.target.name === "description") {
            setFormData({ ...formData, profile_status: { ...formData.profile_status, [e.target.name]: e.target.value } })
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value })
        }
    }

    const onSubmit = e => {
        e.preventDefault();
        const time = moment().format()
        setFormData({ ...formData, modified_at: time })
        console.log("Form data", formData)
    }

    const BanModal = ({ show }) => {
        const [confirmation, setConfirmation] = useState(false)
        const BanUser = e => {
            console.log("this user will be banned")
            // make post request here...
            // api.post requestttttt
            // then close the modal after the request
            setShow(false)
        }
        return (
            <Fragment>
                <Modal show={show} onHide={() => setShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Ban Current User</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo, you're about to ban this user!</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShow(false)}>
                            Close </Button>
                        <Button variant="primary" onClick={() => setConfirmation(true)}>
                            Ban </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={confirmation} onHide={() => setShow(false)} dialogClassName={styles.confModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>ARE YOU SURE?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>This is the last warning!</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => BanUser()}>
                            Ban
                        </Button>
                        <Button variant="secondary" onClick={() => setShow(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        );
    }


    return selected === null ? (
        <div>Loading...</div>
    ) : (
            <Fragment>
                <PageHeader className="text-primary" pageTitle="User Info" />
                <Jumbotron className={styles.jumbotron}>
                    <Button onClick={() => { toggleEdit(!edit) }} className={styles.edit}>
                        Edit
                </Button>
                    <Form onSubmit={onSubmit}>
                        <Form.Row>
                            <Col xl={6}>
                                <Form.Group as={Row} controlId="first_name" >
                                    <Form.Label column xl="2">Created at: </Form.Label>
                                    <Col xl="5" >
                                        <Form.Control plaintext readOnly value={moment(created_at).format('MM/DD/YYYY')} />
                                    </Col>
                                </Form.Group>
                            </Col >
                            <Col xl={6}>
                                <Form.Group as={Row} controlId="modified_at">
                                    <Form.Label column xl="2">Modified at: </Form.Label>
                                    <Col xl="5" >
                                        <Form.Control plaintext readOnly value={moment(modified_at).format('MM/DD/YYYY')} />
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xl={6}>
                                <Form.Group as={Row} controlId="first_name" >
                                    <Form.Label column xl="2">First Name: </Form.Label>
                                    <Col xl="9">
                                        <Form.Control plaintext={edit} readOnly={edit} name="first_name" value={first_name} onChange={onChange} />
                                    </Col>
                                </Form.Group>
                            </Col>
                            <Col xl={6}>
                                <Form.Group as={Row} controlId="last_name">
                                    <Form.Label column xl="2">Last Name: </Form.Label>
                                    <Col xl="9">
                                        <Form.Control plaintext={edit} readOnly={edit} name="last_name" value={last_name} onChange={onChange} />
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xl={6}>
                                <Form.Group as={Row} controlId="email" >
                                    <Form.Label column xl="2">Email: </Form.Label>
                                    <Col xl="9">
                                        <Form.Control plaintext={edit} readOnly={edit} type="email" name="contact_email" value={contact_email} onChange={onChange} />
                                    </Col>
                                </Form.Group>
                            </Col>
                            <Col xl={6}>
                                <Form.Group as={Row} controlId="phone">
                                    <Form.Label column xl="2">Phone#: </Form.Label>
                                    <Col xl="9">
                                        <Form.Control plaintext={edit} readOnly={edit} type="tel" name="contact_phone" value={contact_phone} onChange={onChange} />
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xl={12}>
                                <Form.Group as={Row} controlId="formGridStatus">
                                    <Form.Label column xl="1">Status: </Form.Label>
                                    <Col xl="3">
                                        <Form.Control plaintext={edit} readOnly={edit} disabled={edit} as="select" name="status" defaultValue={status} onChange={onChange} custom>
                                            <option>active</option>
                                            <option>inactive</option>
                                        </Form.Control>
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col xl={12}>
                                <Form.Group as={Row} controlId="formGridStatus">
                                    <Form.Label column xl="1">Description: </Form.Label>
                                    <Col xl="8">
                                        <Form.Control rows="8" plaintext={edit} readOnly={edit} disabled={edit} as="textarea" name="description" defaultValue={description} onChange={onChange} />
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Row>
                            <Col>{!edit && (<Button type="submit" >Submit</Button>)}</Col>
                            <Col><Button variant="danger" className={styles.ban} onClick={() => setShow(true)}>Ban</Button></Col>
                        </Row>
                    </Form>
                    <BanModal show={show} />
                </Jumbotron>
            </Fragment>
        )
}






UserInfo.propTypes = {
    addNotification: PropTypes.func.isRequired,
    getUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
};


const mapStateToProps = state => ({
    user: state.users,
});

export default connect(mapStateToProps, { getUser, addNotification })(UserInfo)