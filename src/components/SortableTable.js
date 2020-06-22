import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import sortBy from 'lodash/sortBy';
import styles from './SortableTable.module.scss';

const tableTitles = {
  firstName: 'First Name',
  lastName: 'Last Name',
  email: 'Email',
  phone: 'Phone',
  donationAmount: 'Amount Donated',
  donationDate: 'Donation Date',
  addtional1: 'Aditional Column',
  addtional2: 'Aditional Column',
};
const mapToPrettyHeader = keys => {
  return keys.map(key => tableTitles[key]);
};

function makeKey(str, append = '') {
  return str.replace(/ /g, '-').toLowerCase() + append;
}

const TableHeader = ({ children, sortFunc, sortKey, sortingBy }) => {
  const [dir, setdir] = useState(null);

  function handleSort() {
    setdir(dir === 'desc' ? 'asc' : 'desc');
    sortFunc(sortKey, dir);
  }

  if (dir && sortingBy === sortKey) {
    return (
      <th className="pointer" onClick={handleSort}>
        {children} <span className={`${styles.sort} ${styles[dir]}`} />
      </th>
    );
  }

  return (
    <th className="pointer" onClick={handleSort}>
      {children} <span className={styles.sort} />
    </th>
  );
};

function SortableTable({ data, ignore }) {
  const [rowData, setRowData] = useState(data);
  const [sortingBy, setSortingBy] = useState(null);

  function doSort(property, dir) {
    setSortingBy(property);
    let sorted = sortBy(data, [property]);
    if (dir === 'desc') {
      sorted = sorted.reverse();
    }
    setRowData(sorted);
  }

  if (data.length === 0) {
    return;
  }

  // create an array of keys with the "ignored" items removed
  const tableKeys = Object.keys(data[0]).filter(key => !ignore.includes(key));
  const headers = mapToPrettyHeader(tableKeys);
  if (!sortingBy) {
    setSortingBy(tableKeys[0]);
  }

  return (
    <Table bordered responsive striped>
      <thead>
        <tr>
          {headers.map((header, i) => {
            return (
              <TableHeader
                sortingBy={sortingBy}
                key={makeKey(header, i)}
                sortFunc={doSort}
                sortKey={tableKeys[i]}
              >
                {header}
              </TableHeader>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {rowData.map(row => {
          return (
            <tr key={row.user_id}>
              {Object.keys(row)
                .filter(key => !ignore.includes(key))
                .map(key => {
                  const val = row[key];
                  if (key.toLowerCase().includes('date')) {
                    return (
                      <td key={`${row.user_id}-${key}`}>
                        <Moment format="MMM DD, YYYY" date={val} />
                      </td>
                    );
                  }
                  return <td key={`${row.user_id}-${key}`}>{val}</td>;
                })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

SortableTable.defaultProps = {
  ignore: [],
};

SortableTable.propTypes = {
  /**
   * Array of data objects for each row in the table
   */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * a list of keys in the data object to ignore when generating table rows
   * things like "user_id", etc
   */
  ignore: PropTypes.arrayOf(PropTypes.string),
};

export default SortableTable;
