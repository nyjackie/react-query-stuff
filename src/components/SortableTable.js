import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import sortBy from 'lodash/sortBy';
import uniqueId from 'lodash/uniqueId';
import styles from './SortableTable.module.scss';
import { mapToPrettyHeader } from 'utils/donation';

/**
 * Table Header <th> component which also handles triggering sort for its column
 */
const TableHeader = ({ children, sortFunc, sortKey, sortingBy }) => {
  const [dir, setdir] = useState(null);

  function handleSort() {
    setdir(dir === 'desc' ? 'asc' : 'desc');
    sortFunc(sortKey, dir);
  }

  if (dir && sortingBy && sortingBy === sortKey) {
    return (
      <th scope="col" className="pointer" onClick={handleSort}>
        {children} <span className={`${styles.sort} ${styles[dir]}`} />
        <span className="sr-only">
          sorted in {dir !== 'asc' ? 'ascending' : 'descending'} order
        </span>
      </th>
    );
  }

  return (
    <th scope="col" className="pointer" onClick={handleSort}>
      {children} <span className={styles.sort} />
      <span className="sr-only">click to sort {dir !== 'asc' ? 'ascending' : 'descending'}</span>
    </th>
  );
};

/**
 * Sortable Table component
 */
function SortableTable({ id, data, ignore }) {
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

  return (
    <Table id={id} borderless striped className={styles.table}>
      <thead>
        <tr>
          {headers.map((header, i) => {
            return (
              <TableHeader
                sortingBy={sortingBy}
                key={`${id}-th-${i}`}
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
        {rowData.map((row, i) => {
          const rowKey = `${id}-row-${i}`;
          return (
            <tr key={rowKey}>
              {Object.keys(row)
                .filter(key => !ignore.includes(key))
                .map((key, n) => {
                  const val = row[key];
                  const reactKey = `${rowKey}-td-${n}`;
                  if (key.toLowerCase().includes('date')) {
                    return (
                      <td key={reactKey}>
                        <Moment format="MMM DD, YYYY" date={val} />
                      </td>
                    );
                  }
                  return <td key={reactKey}>{val}</td>;
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
  id: uniqueId('table'),
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
