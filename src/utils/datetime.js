import moment from 'moment';
import { DATETIME_FORMAT } from './constants';
import { DateTime } from 'luxon';

/**
 * get UTC unix epoch timestamp in seconds
 */
export function getNow() {
  // our tokens expiry use Unix Epoch UTC Timestamps in seconds
  return Math.floor(new Date().getTime() / 1000);
}

/**
 * Convert a timestamp to a UTC one in the format that our API expects
 * @param {string} timestamp a valid timestamp
 */
export function toUTC(timestamp) {
  return moment(timestamp).utc().format(DATETIME_FORMAT);
}

/**
 * Our database stores all timestamps in UTC so this converts a timestamp
 * provided by our API into user's local date time
 * @param {string} timestamp
 */
export function fromUTC(timestamp) {
  return moment.utc(timestamp).local().format(DATETIME_FORMAT);
}

/**
 * Get the user's current timezone name (ex: America/New_York)
 */
export const timeZoneName = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

/**
 * Convert a UTC timestamp to Eastern Time
 * @param {string} timestamp
 */
export function utcToET(timestamp) {
  return DateTime.fromISO(timestamp, { zone: 'utc' })
    .setZone('America/New_York')
    .toFormat('yyyy-MM-dd HH:mm', { hourCycle: 'h23' })
    .split(' ')
    .join('T');
}

/**
 * Convert Eastern Time timestamp to a UTC timestamp
 * @param {string} timestamp
 */
export function etToUTC(timestamp) {
  return DateTime.fromISO(timestamp, { zone: 'America/New_York' })
    .setZone('utc')
    .toFormat('yyyy-MM-dd HH:mm', { hourCycle: 'h23' })
    .split(' ')
    .join('T');
}
