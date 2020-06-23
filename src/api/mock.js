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
        data: guideStarHits(),
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
        },
      },
    ];
  });
  mock.onPost('/internal/search').reply(200, successGuideStarResults());

  /**
   * This flips between success and fail
   */
  let saveReply = 400;
  mock.onPost('/nonprofit/save').reply(function () {
    saveReply = saveReply === 400 ? 200 : 400;
    return [saveReply, {}];
  });

  return mock;
}
