import React from 'react';
import isObject from 'lodash/isObject';
import Modal from 'react-bootstrap/Modal';
import styles from './NonProfitInfo.module.scss';

function DataBasic({ dataKey, val, level }) {
  if (typeof val === 'boolean') {
    return (
      <p className={styles[`info-level-${level}`]}>
        <b className={styles.infoKey}>{dataKey}:</b> <code>{`{${typeof val}}`}</code>{' '}
        {val.toString()}
      </p>
    );
  }
  if (typeof val === 'string' || typeof val === 'number') {
    return (
      <p className={styles[`info-level-${level}`]}>
        <b className={styles.infoKey}>{dataKey}:</b> <code>{`{${typeof val}}`}</code> {val}
      </p>
    );
  }
  if (val === null) {
    return (
      <p className={styles[`info-level-${level}`]}>
        <b className={styles.infoKey}>{dataKey}:</b> null
      </p>
    );
  }
  return null;
}

function DataObject({ data, level }) {
  return Object.keys(data)
    .sort()
    .map((dataKey, i) => {
      const val = data[dataKey];
      const reactKey = `${data.id}-${dataKey}`;

      if (Array.isArray(val)) {
        return (
          <div key={reactKey} className="mt-2">
            <p className="m-0">
              <b className={styles.infoKey}>{dataKey}:</b> <code>{`{array[${val.length}]}`}</code>
            </p>
            <DataArray data={val} level={level + 1} />
          </div>
        );
      }

      if (isObject(val)) {
        return (
          <div key={reactKey} className="mt-2">
            <p className="m-0">
              <b className={styles.infoKey}>{dataKey}:</b> <code>{'{object}'}</code>
            </p>
            <DataObject data={val} level={level + 1} />
          </div>
        );
      }
      return <DataBasic key={reactKey} dataKey={dataKey} val={val} level={level} />;
    });
}

function DataArray({ data, level }) {
  return data.map((item, i) => {
    const reactKey = `${data.id}-array${level}-${i}`;

    if (Array.isArray(item)) {
      return <DataArray key={reactKey} data={item} level={level + 1} />;
    }

    if (isObject(item)) {
      return <DataObject key={reactKey} data={item} level={level + 1} />;
    }
    return <DataBasic key={reactKey} dataKey="" val={item} level={level} />;
  });
}

export default function AllInfoModal({ data, show, handleClose }) {
  return (
    <Modal show={show} onHide={handleClose} dialogClassName={styles.infoModal}>
      <Modal.Header closeButton>
        <Modal.Title>Nonprofit Data</Modal.Title>
      </Modal.Header>

      <Modal.Body>{data && <DataObject data={data} level={0} />}</Modal.Body>
    </Modal>
  );
}
