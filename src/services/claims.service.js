import api from 'api';
import setAuthToken from 'utils/setAuthToken';
import { wait } from 'utils';

async function getClaims() {
  await wait(1000);
  const res = await api.getClaims();
  const token = localStorage.getItem('token');
  setAuthToken(token);
  return [null, res.data];
}

async function getClaim(id) {
  await wait(1000);
  const res = await api.getClaim(id);
  const token = localStorage.getItem('token');
  setAuthToken(token);
  return [null, res.data];
}

export default {
  getClaims,
  getClaim,
};
