import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

import { useGetUser } from 'hooks/useUsers';
import Spinner from 'components/Spinner';
import ConsumerUser from './ConsumerUser';
import BrandUser from './BrandUser';
import NonprofitUser from './NonprofitUser';
import AdminUser from './AdminUser';

const userTypeMap = {
  consumer: ConsumerUser,
  brand: BrandUser,
  nonprofit: NonprofitUser,
  internal: AdminUser,
};

function UserInfo({ id, type, setNotification, includeHeader }) {
  // const [show, setShow] = useState(false);
  // const [edit, toggleEdit] = useState(true);
  const { isLoading, isError, data, error } = useGetUser(id, type);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  const UserComponent =
    type in userTypeMap ? userTypeMap[type] : () => <p>User Type: {type} not supported</p>;

  return (
    <>
      <Helmet>
        <title>
          {type.charAt(0).toUpperCase() + type.slice(1)} User | Admin Portal | Give Good Deeds
        </title>
      </Helmet>
      <UserComponent data={{ ...data, user_id: id }} type={type} includeHeader={includeHeader} />
    </>
  );
}

UserInfo.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.string,
  includeHeader: PropTypes.bool,

  setNotification: PropTypes.func,
};

export default UserInfo;
