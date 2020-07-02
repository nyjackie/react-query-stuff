import api from 'api';
import { wait } from 'utils';

async function getClaims() {
  try {
    await wait(1000);
    const res = await api.getClaims();
    return [null, res.data];
  } catch (err) {
    return [err, null];
  }
}

async function getClaim(id) {
  try {
    await wait(1000);
    const res = await api.getClaim(id);
    return [null, res.data];
  } catch (err) {
    return [err, null];
  }
}

export default {
  getClaims,
  getClaim,
};
