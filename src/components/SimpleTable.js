import React from 'react';
import uniqueId from 'lodash/uniqueId';

function TR({ id, row }) {
  if (Array.isArray(row)) {
    return (
      <tr>
        {row.map((val, i) => {
          return <td key={`${id}-td-${i}`}>{val}</td>;
        })}
      </tr>
    );
  }
  return (
    <tr>
      {Object.keys(row).map((key, i) => {
        const val = row[key];
        return <td key={`${id}-td-${i}`}>{val}</td>;
      })}
    </tr>
  );
}

function SimpleTable({ id, headers, data, caption }) {
  const _id = id || uniqueId('table');

  return (
    <table>
      {caption && <caption>{caption}</caption>}
      {headers.length > 0 && (
        <thead>
          <tr>
            {headers.map((h, i) => {
              return (
                <th scope="col" key={`${_id}-header-${i}`}>
                  {h}
                </th>
              );
            })}
          </tr>
        </thead>
      )}
      <tbody>
        {data.map((row, i) => {
          const rowKey = `${_id}-row-${i}`;
          return <TR key={rowKey} id={rowKey} row={row} />;
        })}
      </tbody>
    </table>
  );
}

SimpleTable.defaultProps = {
  headers: [],
};

export default SimpleTable;
