import { api } from 'gdd-components';
import { wait } from 'utils';

async function getClaims() {
  try {
    // TODO: remove fake wait when API is ready
    await wait(1000);
    const res = await api.claims.getAll();
    return [null, res.data];
  } catch (err) {
    return [err, null];
  }
}

async function getClaim(id) {
  try {
    // TODO: remove fake wait when API is ready
    await wait(1000);
    const res = await api.claims.getSingle(id);
    return [null, res.data];
  } catch (err) {
    return [err, null];
  }
}

export default {
  getClaims,
  getClaim,
};
