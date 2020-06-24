import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Toast } from 'react-bootstrap';
import { setNotification } from 'actions/notifications';
const Notification = ({ notifications, notifications: { id }, setNotification }) => {
  return (
    notifications !== null &&
    notifications.length > 0 &&
    notifications.map(notification => {
      return (
        <div
          aria-live="polite"
          aria-atomic="true"
          style={{ position: 'relative', minHeight: '45px' }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0 }}>
            <Toast
              key={notification.id}
              show={notification.show}
              onClick={() => {
                setNotification('', notification.id, false);
              }}
            >
              <Toast.Header>
                <strong className="mr-auto">{notification.msg}</strong>
              </Toast.Header>
            </Toast>
          </div>
        </div>
      );
    })
  );
};
Notification.propTypes = {
  notifications: PropTypes.array.isRequired,
  setNotification: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  notifications: state.notification,
});

export default connect(mapStateToProps, { setNotification })(Notification);
