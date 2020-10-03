import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { addNotification } from 'actions/notifications';
import { useGetUser } from 'hooks/useUsers';
import Spinner from 'components/Spinner';
import ConsumerUser from './ConsumerUser';
import BrandUser from './BrandUser';
import NonprofitUser from './NonprofitUser';
import AdminUser from './AdminUser';

function UserInfo({ match, addNotification }) {
  const { id, type } = match.params;
  // const [show, setShow] = useState(false);
  // const [edit, toggleEdit] = useState(true);
  const { isLoading, isError, data, error } = useGetUser(id, type);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  data.user_id = id;

  switch (type) {
    case 'consumer':
      return <ConsumerUser data={data} />;
    case 'brand':
      return <BrandUser data={data} />;
    case 'nonprofit':
      return <NonprofitUser data={data} />;
    case 'internal':
      return <AdminUser data={data} />;
    default:
      return <p>type: {type} not supported yet</p>;
  }
}

UserInfo.propTypes = {
  addNotification: PropTypes.func.isRequired,
};

export default connect(null, { addNotification })(UserInfo);
