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
const guideStarHits = (total = 5) => {
  const data = Array(total)
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
        mission: faker.lorem.paragraphs(),
        description: faker.lorem.paragraphs(),
        category: '',
        website_url: faker.internet.url(),
        logo_url: 'https://picsum.photos/seed/barrel/215/215',
        hero_url: 'https://picsum.photos/seed/0/949/215',
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
  return data;
};

const npList = guideStarHits(20);
const claimsList = npList.map(np => {
  return {
    id: faker.random.number(),
    created_at: faker.date.past(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    role: faker.fake('{{lorem.word}} {{lorem.word}}'),
    source: faker.lorem.sentence(),
    nonprofit: np,
  };
});

const userHits = (total = 10) => {
  const data = Array(total)
    .fill({})
    .map(() => {
      return {
        id: faker.random.number(),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        profile_status: {
          status: '',
          description: '',
        },
        contact_email: faker.internet.email(),
        contact_phone: faker.phone.phoneNumber(),
        password_hash: faker.lorem.sentence(),
        donationData: fakeUserTableData(),
        created_at: faker.date.past(),
        modified_at: faker.date.past(),
      };
    });
  return data;
};
function successGuideStarResults(total) {
  return {
    code: 200,
    message: 'Request was processed successfully!',
    took: 42,
    errors: [],
    data: {
      took: 39,
      total_hits: total,
      hits: guideStarHits(total),
    },
  };
}

function successUserResults(total) {
  return {
    code: 200,
    message: 'Request was processed successfully!',
    took: 42,
    errors: [],
    data: {
      took: 39,
      total_hits: total,
      hits: userHits(total),
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
        data: claimsList,
      },
    ];
  });

  function route(path = '') {
    return typeof path === 'string' ? new RegExp(path.replace(/:\w+/g, '[^/]+')) : path;
  }

  function getRouteParam(route, url) {
    const _url = url.split('/');
    const _route = route.split('/');
    return _url.reduce((acc, item, i) => {
      const param = _route[i];
      if (!param || !param.startsWith(':')) return acc;
      acc[param.substring(1)] = item;
      return acc;
    }, {});
  }

  mock.onGet(/\/claims\/\d+/).reply(function (config) {
    const params = getRouteParam('/claims/:id', config.url);
    return [
      200,
      {
        data: claimsList.find(c => c.id.toString() === params.id),
      },
    ];
  });

  mock.onPost('/internal/nonprofit').reply(200, successGuideStarResults());
  mock.onPost('/internal/users').reply(200, successUserResults());
  mock.onGet(route('/internal/users/:id')).reply(function (config) {
    return [
      200,
      {
        data: {
          id: faker.random.number(),
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          profile_status: {
            status: 'active',
            description: 'some random description',
          },
          contact_email: faker.internet.email(),
          contact_phone: faker.phone.phoneNumber(),
          password_hash: faker.lorem.sentence(),
          donationData: fakeUserTableData(),
          created_at: faker.date.past(),
          modified_at: faker.date.past(),
        },
      },
    ];
  });

  /**
   * This flips between success and fail
   */
  let saveReply = 400;
  mock.onPost('/nonprofit/save').reply(function () {
    saveReply = saveReply === 400 ? 200 : 400;
    return [saveReply, {}];
  });

  mock.onPost('/internal/password/reset').reply(function () {
    return [200, {}];
  });

  mock.onGet('/internal/banned').reply(function () {
    return [
      200,
      {
        data: Array(20)
          .fill(' ')
          .map(() => {
            return {
              id: faker.random.number(),
              ein: faker.fake('{{random.number}}-{{random.number}}'),
              name: faker.company.companyName(),
              bannedBy: faker.internet.email(),
              bannedReason: faker.lorem.sentence(),
            };
          }),
      },
    ];
  });

  return mock;
}
