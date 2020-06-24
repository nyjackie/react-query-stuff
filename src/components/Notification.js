import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Toast } from 'react-bootstrap';
import { setNotification } from 'actions/notifications';

function Notification({ notification }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      key={notification.id}
      style={{ position: 'relative', minHeight: '45px' }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0 }}>
        <Toast
          show={notification.show}
          onClick={() => {
            setNotification('', notification.id, false);
          }}
          style={{ minWidth: '300px' }}
        >
          <Toast.Header>
            <strong className="mr-auto">{notification.msg}</strong>
          </Toast.Header>
        </Toast>
      </div>
    </div>
  );
}

const Notifications = ({ notifications, setNotification }) => {
  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: '10' }}>
      {notifications.map(notification => {
        return <Notification notification={notification} />;
      })}
    </div>
  );
};

Notifications.propTypes = {
  notifications: PropTypes.array.isRequired,
  setNotification: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  notifications: state.notification,
});

export default connect(mapStateToProps, { setNotification })(Notifications);
