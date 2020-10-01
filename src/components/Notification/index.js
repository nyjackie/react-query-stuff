import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './Notification.scss';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { removeNotification } from 'actions/notifications';

const FadeTransition = props => (
  <CSSTransition {...props} classNames="notification" timeout={{ enter: 500, exit: 300 }} />
);

const Notification = ({ notification, removeNotification }) => {
  return (
    <TransitionGroup className="toasts">
      {notification !== null &&
        notification.length > 0 &&
        notification.map(toast => (
          <FadeTransition key={toast.id} className={`notification notification-${toast.variant}`}>
            <div>
              <div className="flex-grow-1">{toast.msg}</div>
              <span
                className="mr-3 cursor-pointer"
                onClick={() => {
                  removeNotification(toast.id);
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4 12L12 4" stroke="#536567" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M4 4L12 12" stroke="#536567" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>
            </div>
          </FadeTransition>
        ))}
    </TransitionGroup>
  );
};

Notification.propTypes = {
  notification: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  notification: state.notification,
});

export default connect(mapStateToProps, { removeNotification })(Notification);
