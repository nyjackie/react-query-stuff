import pick from 'lodash/pick';
/**
 * some helpful utils for the donation tables
 */

export const tableHeaders = {
  firstName: 'First Name',
  lastName: 'Last Name',
  email: 'Email',
  phone: 'Phone',
  donationAmount: 'Amount Donated',
  donationDate: 'Donation Date',
  addtional1: 'Aditional Column',
  addtional2: 'Aditional Column',
};

/**
 * Convert an array of api properties into nice looking table headers
 * @param {array} keys
 */
export const mapToPrettyHeader = keys => {
  return keys.map(key => tableHeaders[key] || key);
};

export function processForDownload(data) {
  return data
    .map(d =>
      pick(d, [
        'firstName',
        'lastName',
        'email',
        'phone',
        'donationAmount',
        'donationDate',
        'addtional1',
        'addtional2',
      ])
    )
    .map(d => {
      const obj = {};
      let n = 2;

      Object.keys(d).forEach(k => {
        const val = d[k];
        const hd = tableHeaders[k] || k;
        if (obj[hd]) {
          obj[hd + n] = val;
          n += 1;
        } else {
          obj[hd] = val;
        }
      });

      return obj;
    });
}

/**
 * converts table data into an array of objects using DOM api
 * @param {HTMLTableElement} table
 */
export function makeCSVData(table) {
  const headers = Array.from(table.querySelectorAll('th')).map(th => {
    return th.childNodes[0].textContent;
  });
  return Array.from(table.querySelectorAll('tbody tr')).map(tr => {
    const obj = {};
    let n = 1;
    tr.querySelectorAll('td').forEach((td, i) => {
      let h = headers[i];
      if (obj[h]) {
        obj[h + n] = td.textContent;
        n += 1;
      }
      obj[h] = td.textContent;
    });
    return obj;
  });
}
