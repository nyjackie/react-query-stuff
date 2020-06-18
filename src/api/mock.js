import MockAdapter from 'axios-mock-adapter';
import { fakeJWT, decryptBasicAuth } from 'utils';

export default function (axiosInstance) {
  const mock = new MockAdapter(axiosInstance);
  console.log('inside?', mock);

  mock.onPost('/users/login').reply(function (config) {
    const creds = decryptBasicAuth(config.headers.Authorization);

    if (creds.password === '401') {
      return [401, {}];
    }

    return [
      200,
      {
        token: fakeJWT(creds.email),
      },
    ];
  });

  mock.onGet('/claims').reply(function (config) {
    return [
      200,
      {
        data: [
          {
            _id: '1',
            description: 'CLAIM REQUEST 1111',
            user: 'alpha@gdd.com',
            date: '2020-04-02T20:38:22.115Z',
          },
          {
            _id: '2',
            description: 'CLAIM REQUEST 222',
            user: 'beta@gdd.com',
            date: '2020-05-20T20:38:22.115Z',
          },
          {
            _id: '3',
            description: 'CLAIM REQUEST 3333',
            user: 'gamma@gdd.com',
            date: '2020-06-09T20:38:22.115Z',
          },
          {
            _id: '4',
            description: 'CLAIM REQUEST 44444',
            user: 'delta@gdd.com',
            date: '2020-06-15T20:38:22.115Z',
          },
        ],
      },
    ];
  });

  function route(path = '') {
    return typeof path === 'string' ? new RegExp(path.replace(/:\w+/g, '[^/]+')) : path;
  }

  mock.onGet(route('claims/:id')).reply(function (config) {
    return [
      200,
      {
        data: {
          _id: '1',
          description: 'CLAIM REQUEST 1111',
          user: 'alpha@gdd.com',
          date: '2020-04-02T20:38:22.115Z',
        },
      },
    ];
  });
  return mock;
}
