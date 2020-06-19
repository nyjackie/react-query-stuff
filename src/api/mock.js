import MockAdapter from 'axios-mock-adapter';
import faker from 'faker';
import { fakeJWT, decryptBasicAuth } from 'utils';

faker.seed(111);

function randBetween(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const ein = () => `${randBetween(10, 99)}-${randBetween(1000000, 5555555)}`;

/**
 * guidestar essentials api documentation
 * https://apiportal.guidestar.org/api-static-documentation-v3
 *
 * faker docs: http://marak.github.io/faker.js/
 */

function successGuideStarResults(total = 5) {
  const guideStarHits = Array(total)
    .fill({})
    .map(() => {
      return {
        organization_id: faker.random.number(),
        bridge_id: faker.random.number(),
        ein: ein(),
        organization_name: faker.company.companyName(),
        also_known_as: faker.company.companyName(),
        mission: faker.lorem.sentence(),
        address_line_1: faker.address.streetAddress(),
        address_line_2: faker.address.secondaryAddress(),
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        zip: faker.address.zipCode(),
        lat_long: faker.fake('{{address.latitude}},{{address.longitude}}'),
        ntee_code: faker.fake(
          'T50 {{lorem.word}} / {{lorem.word}} / {{lorem.word}} {{lorem.word}} ({{lorem.word}})'
        ),
        public_report: faker.internet.url(),
        subsection_code: '501(c)(3) Public Charity',
        number_of_employees: faker.random.number(),
        website_url: faker.internet.url(),
        logo_url: faker.image.avatar(),
        bmf_gross_receipts: '11269539',
        bmf_assets: '3965331',
        form990_total_revenue: '11253739',
        form990_total_expenses: '12792537',
        form990_total_assets: '3965331',
        contact_email: faker.internet.email(),
        contact_name: faker.fake('{{name.firstName}} {{name.lastName}}'),
        contact_phone: faker.phone.phoneNumber(),
        contact_title: faker.name.jobTitle(),
      };
    });

  return {
    code: 200,
    message: 'Request was processed successfully!',
    took: 42,
    errors: [],
    data: {
      took: 39,
      total_hits: total,
      hits: guideStarHits,
    },
  };
}

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
  mock.onPost('/internal/search').reply(200, successGuideStarResults());

  return mock;
}
