import MockAdapter from 'axios-mock-adapter';
import { fakeJWT } from 'utils';

export default function (axiosInstance) {
  // This sets the mock adapter on the default instance
  const mock = new MockAdapter(axiosInstance);

  // Routes
  console.log('its hitting here');
  mock.onPost('/users/login').reply(401, {
    token: fakeJWT(),
  });

  return mock;
}
