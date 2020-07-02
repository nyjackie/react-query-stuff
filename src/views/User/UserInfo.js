import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import {
    Modal,
    Button,
    InputGroup,
    FormControl,
    Col,
    Row,
    Container,
    Jumbotron,
} from 'react-bootstrap';
import PageHeader from 'components/PageHeader';
import { connect } from 'react-redux';
import { getUser } from 'actions/user';


const UserInfo = ({ 
    getUser, 
    match,
    user,
}) => {
    useEffect(() => {
        getUser(match.params.id);
      }, [getUser, match.params.id]);

      return user === null ? (
        <div>Loading...</div>
      ) : (
          <Fragment>
              <Jumbotron>
              <Row>
                  <Col className="col-md-4">
                    Name: {user.first_name}{' '}{user.last_name}
                  </Col>
                  </Row>
                  <br/>
                  <Row>
                      <Col className="col-md-4">ID: {user.id}</Col>
                      <Col>Registered Date: <Moment format="YYYY/MM/DD">{user.created_at}</Moment></Col>
                  
                  </Row>
                  <Row>
                      <Col className="col-md-4">
                      Email: {user.contact_email}
                      </Col>
                      <Col className="col-md-4">
                      Phone: {user.contact_phone}
                      </Col>
                  </Row>
                  <br/>
                  <Row>
                      <Col>Status: {user.profile_status.status}</Col>
                  </Row>
                  <Row>
                      <Col>Description: {user.profile_status.description}</Col>
                  </Row>
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