import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { addNotification } from 'actions/notifications';
import { useGetUser } from 'hooks/useUsers';
import Spinner from 'components/Spinner';
import ConsumerUser from './ConsumerUser';
import BrandUser from './BrandUser';
import NonprofitUser from './NonprofitUser';
import AdminUser from './AdminUser';

const MatchUser = ({ type, user }) => {
  switch (type) {
    case 'consumer':
      return <ConsumerUser data={user} />;
    case 'brand':
      return <BrandUser data={user} />;
    case 'nonprofit':
      return <NonprofitUser data={user} />;
    case 'internal':
      return <AdminUser data={user} />;
    default:
      return <p>Type: {user.type} not supported yet</p>;
  }
}

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

  return (
    <>
      <Helmet>
        <title>{type.charAt(0).toUpperCase() + type.slice(1)} User | Admin Portal | Give Good Deeds</title>
      </Helmet>
      <MatchUser user={data} type={type} />
    </>
  )
}

UserInfo.propTypes = {
  match: PropTypes.object,
};

export default UserInfo;
