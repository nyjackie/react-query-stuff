import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Notifications } from 'gdd-components';
import { removeNotification } from 'actions/notifications';

/**
 * @param { id: string, msg: string, variant: 'success' | 'error' | 'warning' | 'info' } notification
 * @param Function removeNotification
 */

const Notification = ({ notifications, removeNotification }) => {
  return <Notifications notifications={notifications} removeNotifications={removeNotification} />;
};

Notification.propTypes = {
  notifications: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  notifications: state.notifications,
});

export default connect(mapStateToProps, { removeNotification })(Notification);
