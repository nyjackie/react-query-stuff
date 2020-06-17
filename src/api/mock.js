import MockAdapter from 'axios-mock-adapter';
import { fakeJWT, decryptBasicAuth } from 'utils';

export default function (axiosInstance) {
  // This sets the mock adapter on the default instance
  const mock = new MockAdapter(axiosInstance);

  // Routes
  mock.onPost('/users/login').reply(function (config) {
    // `config` is the axios config and contains things like the url
    const creds = decryptBasicAuth(config.headers.Authorization);
    console.log(creds);

    if (creds.password === '401') {
      // return an array in the form of [status, data, headers]
      return [401, {}];
    }

    return [
      200,
      {
        token: fakeJWT(),
      },
    ];
  });

  return mock;
}
