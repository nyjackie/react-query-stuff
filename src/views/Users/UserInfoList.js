import React from 'react';
import PropTypes from 'prop-types';
import { Container, Accordion, Card, Button, Col, Row } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import styles from './User.module.scss';

import UserInfo from 'views/Users/UserInfo';

function UserInfoList({ ids, type }) {
  return (
    <>
      <Accordion as={Container} className={styles.userEditList} defaultActiveKey={ids[0]}>
        <Card.Header>
          <Col>
            <h2>Users List</h2>
          </Col>
        </Card.Header>
        {!ids.length && (
          <Card.Body>
            <p>No users attached to this nonprofit</p>
          </Card.Body>
        )}
        {ids.map(id => {
          return (
            <Card key={id}>
              <Accordion.Toggle as={Card.Header} variant="link" eventKey={id}>
                <Row>
                  <Col sm={8}>
                    <Button variant={'link'}>User ID: {id}</Button>
                  </Col>
                  <Col sm={4}>
                    <Button
                      as={NavLink}
                      style={{ float: 'right' }}
                      variant={'link'}
                      to={`/users/${type}/${id}`}
                    >
                      Go To User Page
                    </Button>
                  </Col>
                </Row>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey={id}>
                <UserInfo id={id} type={type} includeHeader={false} />
              </Accordion.Collapse>
            </Card>
          );
        })}
      </Accordion>
    </>
  );
}

UserInfoList.propTypes = {
  ids: PropTypes.array,
  type: PropTypes.string,
};

export default UserInfoList;
