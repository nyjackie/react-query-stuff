/**
 * @typedef {object} NonprofitCategory
 * @property {integer} id
 * @property {string} name
 * @property {string} logo_url
 * @property {string} main_color
 * @property {string} hero_color
 * @property {string} nonprofit_hero_color
 * @property {boolean} has_nonprofits
 */

/**
 * @typedef {object} NonprofitAddress:
 * @description The address of a nonprofit
 * @property {string} address_line_1 First address line
 * @property {string} address_line_2 Second address line
 * @property {string} city City which the nonprofit resides
 * @property {string} county County which the nonprofit resides
 * @property {string} state State in which the city resides
 * @property {string} zip Zip code which the nonprofit resides
 * @property {string} msa Metropolitan Statistical Area
 * @property {string} lat_long Latitude and longitude
 */

/**
 * @typedef {object} NonprofitUser
 * @property {integer} id the user's id
 * @property {object} type
 * @property {string} type.id
 * @property {string} type.name ie nonprofit
 * @property {integer} nonprofit_id nonprofit_id user is associated with
 * @property {string} first_name User's first name.
 * @property {string} last_name User's last name.
 * @property {string} email User's email.
 * @property {string} phone_number User's phone number.
 * @property {boolean} active
 * @property {string} created_at
 * @property {string} modified_at
 */

/**
 * @typedef {object} NonprofitClaim
 * @property {string} first_name First name of the claim user"
 * @property {string} last_name Last name of the claim maker"
 * @property {string} email Email of the claim maker"
 * @property {string} phone_number Phone number of the claim maker"
 * @property {string} role Role of the claim maker in the nonprofit"
 * @property {string} referral_source Where the user found out about Good Deeds"
 */

/**
 * @typedef {object} InternalNonProfit
 * @property {integer} id
 * @property {string} ein
 * @property {string} name
 * @property {string} alias
 * @property {object} status
 * @property {integer} status.id
 * @property {string} status.name
 * @property {string} status.description
 * @property {string} contact_email The contact email pulled from Guidestar
 * @property {string} contact_phone The contact phone pulled from Guidestar
 * @property {string} gross_receipts
 * @property {string} ntee_code
 * @property {string} subsection_code
 * @property {integer} guidestar_id
 * @property {integer} bridge_id
 * @property {string} website_url
 * @property {string} location
 * @property {string} mission
 * @property {string} description
 * @property {string} logo_url
 * @property {string} hero_url
 * @property {NonprofitCategory[]} categories
 * @property {NonprofitAddress} address
 * @property {boolean} is_banned
 * @property {boolean} is_active
 * @property {boolean} is_folded
 * @property {NonprofitUser[]} users list of users that belong to this nonprofit
 * @property {NonprofitClaim[]} claim list of claims
 * @property {string} created_at
 * @property {string} modified_at
 */

/**
 * @typedef {object} NonprofitEditableProps
 * @description these are the properties that the PUT request body accepts https://endpointsportal.gdd-backend-asgard-staging.cloud.goog/docs/bifrost.endpoints.gdd-backend-asgard-staging.cloud.goog/0/routes/portal/internal/nonprofit/%7Bnonprofit_id%7D/put
 * @property {NonprofitAddress} address
 * @property {NonprofitCategory[]} categories
 * @property {boolean} is_banned
 * @property {boolean} is_active
 * @property {boolean} is_folded
 * @property {string} mission
 * @property {string} name
 * @property {string} website_url
 */
