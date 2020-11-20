/**
 * Local in-memory store of properties that should be sent with every 'track'
 * request. This will contain:
 * - user_id
 * - nonprot_id
 * - email
 *
 * use the segmentLogin in the login form or autologin flow to set this
 */
let userProperties = {};

/**
 * Segment manual Identify
 * https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#identify
 *
 * analytics.identify([userId], [traits], [options], [callback]);
 * @param {string} [userId] The database ID for the user. If you don’t know who
 * the user is yet, you can omit the userId and just record traits
 * @param {object} [traits] A dictionary of traits you know about the user, like
 * their email or name.
 * @param {object} [options] A dictionary of options. For example, enable or
 * disable specific destinations for the call.
 */
export function identify(userId, traits, options = {}) {
  const segment = window.analytics;
  if (!segment || !segment.identify) {
    console.warn('Segment analytics.js not found');
    return;
  }

  if (userId && traits) {
    segment.identify(userId, traits, options);
    return;
  }

  // traits can be sent without userId
  if (!userId && traits) {
    segment.identify(traits, options);
  }
}

/**
 * Store currently tracked events so we don't send duplicate tracked events
 * within a certain time period
 */
let tracked = [];

/**
 * Segment manual event track
 * https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#track
 *
 * analytics.track(event, [properties], [options], [callback]);
 * https://segment.com/docs/connections/spec/track/
 *
 * @param {string} event The name of the event you’re tracking. "We recommend
 * event names built from a noun and past-tense verb"
 * @param {object} [properties] A dictionary of properties for the event. If the
 * event was 'Added to Cart', it might have properties like price and
 * productType.
 * @param {object} [options] A dictionary of options. For example, enable or
 * disable specific destinations for the call.
 */
export function track(event, properties = {}, options = {}) {
  const segment = window.analytics;
  if (!segment) {
    console.warn('Segment analytics.js not found');
    return;
  }

  if (tracked.includes(event)) {
    return;
  }

  // store event to prevent duplicate tracks within 1s of last.
  tracked.push(event);

  const finalProperties = Object.assign({}, userProperties, properties);

  segment.track(event, finalProperties, options);

  setTimeout(() => {
    tracked = tracked.filter(e => e !== event);
  }, 1000);
}

/**
 * Use this special function from a login/auto-login to set the local in-memory
 * user properties so that they can be sent with every future request
 * @param {string} userId
 * @param {string} email
 * @param {string} nonprofit_id
 */
export function segmentLogin(user_id, email, nonprofit_id) {
  if (userProperties.email && userProperties.user_id) {
    // we've already logged in so we don't need to send identify again
    return;
  }

  identify(user_id, {
    email,
    nonprofit_id,
  });

  /**
   * Set local properties to be used in every subsequent call
   */
  userProperties = {
    user_id,
    email,
    nonprofit_id,
  };
}
