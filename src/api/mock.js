import MockAdapter from 'axios-mock-adapter';
import faker from 'faker';
import { fakeJWT, decryptBasicAuth } from 'utils';

faker.seed(111);

/**
 * This needs to be updated when we get the final api scheme
 * This will be used in the table of donation data on a profile page
 */
function fakeUserTableData() {
  return Array(30)
    .fill(0)
    .map(() => {
      return {
        user_id: faker.random.uuid(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
        donationAmount: faker.finance.amount(),
        donationDate: faker.date.past(),
        addtional1: 'Value',
        addtional2: 'Value',
      };
    });
}

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
        id: faker.random.number(),
        ein: faker.fake('{{random.number}}-{{random.number}}'),
        name: faker.company.companyName(),
        alias: faker.company.companyName(),
        profile_status: {
          status: '',
          description: '',
        },
        mission: faker.lorem.paragraph(),
        description: faker.lorem.paragraphs(),
        category: '',
        website_url: faker.internet.url(),
        logo_url: faker.image.avatar(),
        hero_url: null,
        contact_email: faker.internet.email(),
        contact_name: faker.fake('{{name.firstName}} {{name.lastName}}'),
        contact_phone: faker.phone.phoneNumber(),
        gross_receipts: '11269539',
        ntee_code: faker.fake(
          'T50 {{lorem.word}} / {{lorem.word}} / {{lorem.word}} {{lorem.word}} ({{lorem.word}})'
        ),
        subsection_code: '501(c)(3) Public Charity',
        guidestar_id: faker.random.number(),
        bridge_id: faker.random.number(),
        address: {
          address_line_1: faker.address.streetAddress(),
          address_line_2: faker.address.secondaryAddress(),
          city: faker.address.city(),
          state: faker.address.stateAbbr(),
          zip: faker.address.zipCode(),
          msa: '',
          lat_long: faker.fake('{{address.latitude}},{{address.longitude}}'),
        },
        donationData: fakeUserTableData(),
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
            company: 'Company1',
            description: 'CLAIM REQUEST 1111',
            user: 'alpha@gdd.com',
            date: '2020-04-02T20:38:22.115Z',
          },
          {
            _id: '2',
            company: 'Company2',
            description: 'CLAIM REQUEST 222',
            user: 'beta@gdd.com',
            date: '2020-05-20T20:38:22.115Z',
          },
          {
            _id: '3',
            company: 'Company3',
            description: 'CLAIM REQUEST 3333',
            user: 'gamma@gdd.com',
            date: '2020-06-09T20:38:22.115Z',
          },
          {
            _id: '4',
            company: 'Company4',
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
