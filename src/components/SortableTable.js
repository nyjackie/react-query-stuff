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
const TableHeader = ({ children, sortFunc, sortKey, sortingBy, dataType }) => {
  const [dir, setdir] = useState(null);
  const thClassName = ['pointer'];
  if (dataType === 'currency') {
    thClassName.push('text-right');
  }

  function handleSort() {
    setdir(dir === 'desc' ? 'asc' : 'desc');
    sortFunc(sortKey, dir);
  }

  if (dir && sortingBy && sortingBy === sortKey) {
    return (
      <th scope="col" className={thClassName.join(' ')} onClick={handleSort}>
        {children} <span className={`${styles.sort} ${styles[dir]}`} />
        <span className="sr-only">
          sorted in {dir !== 'asc' ? 'ascending' : 'descending'} order
        </span>
      </th>
    );
  }

  return (
    <th scope="col" className={thClassName.join(' ')} onClick={handleSort}>
      {children} <span className={styles.sort} />
      <span className="sr-only">click to sort {dir !== 'asc' ? 'ascending' : 'descending'}</span>
    </th>
  );
};

/**
 * Sortable Table component
 */
function SortableTable({ id, data, ignore, columnTypes, rowKey }) {
  const [rowData, setRowData] = useState(data);
  const [sortingBy, setSortingBy] = useState(null);
  const _id = id || uniqueId('table');

  function doSort(property, dir) {
    setSortingBy(property);
    const dataType = columnTypes[property] || 'string';
    let sorted;
    if (dataType === 'currency') {
      sorted = [...data].sort((a, b) => {
        return a[property] - b[property];
      });
    } else {
      sorted = sortBy(data, [property]);
    }
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
    <Table id={_id} borderless striped responsive className={styles.table}>
      <thead>
        <tr>
          {headers.map((header, i) => {
            return (
              <TableHeader
                sortingBy={sortingBy}
                key={`${_id}-th-${i}`}
                sortFunc={doSort}
                sortKey={tableKeys[i]}
                dataType={columnTypes[tableKeys[i]]}
              >
                {header}
              </TableHeader>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {rowData.map(row => {
          const _key = row[rowKey];
          return (
            <tr key={_key}>
              {Object.keys(row)
                .filter(key => !ignore.includes(key))
                .map(key => {
                  const val = row[key];
                  const reactKey = `${_key}-${key}`;
                  const dataType = columnTypes[key] || 'string';
                  if (dataType === 'date') {
                    return (
                      <td key={reactKey}>
                        <Moment format="MMM DD, YYYY" date={val} />
                      </td>
                    );
                  }
                  if (dataType === 'currency') {
                    return (
                      <td key={reactKey} className="text-right">
                        ${val}
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
  columnTypes: {},
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

  /**
   * an object mapping a column to a specific data type
   */
  columnTypes: PropTypes.object,

  /**
   * Tell the component which property in each object is to be used in the `key`
   * property when iterating and dynamically creating rows
   */
  rowKey: PropTypes.string.isRequired,
};

export default SortableTable;
