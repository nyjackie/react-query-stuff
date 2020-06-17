import MockAdapter from 'axios-mock-adapter';
import { fakeJWT } from 'utils';

export default function (axiosInstance) {
  // This sets the mock adapter on the default instance
  const mock = new MockAdapter(axiosInstance);

  // Routes

  mock.onPost('/users/login').reply(200, {
    token: fakeJWT(),
  });

  return mock;
}
