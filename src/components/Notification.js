import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Toast } from 'react-bootstrap';
import { removeNotification } from 'actions/notifications';
import styles from './Notification.module.scss';

const Notification = ({ notification, onClose }) => {
  const [show, setShow] = useState(true);

  return (
    <div aria-live="polite" aria-atomic="true" className={styles.toastContainer}>
      <div className={styles.toastInner}>
        <Toast
          autohide
          delay={notification.waitTime}
          show={show}
          onClose={() => {
            setShow(false);
            onClose();
          }}
          className={`${styles.toast} ${styles[notification.variant]}`}
        >
          <Toast.Header>
            <strong className="mr-auto">{notification.msg}</strong>
          </Toast.Header>
        </Toast>
      </div>
    </div>
  );
};

const Notifications = ({ notifications, removeNotification }) => {
  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      {notifications.map(notification => {
        return (
          <Notification
            key={notification.id}
            notification={notification}
            onClose={() => {
              setTimeout(() => {
                removeNotification(notification.id);
              }, 160); // Boostrap's Toast css fade is 150ms
            }}
          />
        );
      })}
    </div>
  );
};

Notifications.propTypes = {
  notifications: PropTypes.array.isRequired,
  removeNotification: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  notifications: state.notification,
});

export default connect(mapStateToProps, { removeNotification })(Notifications);
