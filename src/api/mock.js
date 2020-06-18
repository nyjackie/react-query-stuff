import MockAdapter from 'axios-mock-adapter';
import { fakeJWT, decryptBasicAuth } from 'utils';

export default function (axiosInstance) {
  const mock = new MockAdapter(axiosInstance);

  mock.onPost('/users/login').reply(function (config) {
    const creds = decryptBasicAuth(config.headers.Authorization);

    if (creds.password === '401') {
      return [401, {}];
    }

    if (creds.password === '500') {
      return [500, {}];
    }

    return [
      200,
      {
        token: fakeJWT(creds.email),
      },
    ];
  });

  return mock;
}
