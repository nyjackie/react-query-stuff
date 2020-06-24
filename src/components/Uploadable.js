import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './Uploadable.module.scss';

function Uploadable(props) {
  const [file, setFile] = useState(null);
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: false,
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0];
      if (file) {
        setFile(
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    onDropRejected: e => {
      console.error('onDropRejected', e);
    },
  });
  const thumb = file && (
    <div className={styles.thumb} key={file.name}>
      <div className={styles.thumbInner}>
        <img src={file.preview} className={styles.img} alt="" />
      </div>
    </div>
  );

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      if (file) URL.revokeObjectURL(file.preview);
    },
    [file]
  );

  return (
    <section className="container">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Upload photo (drag image here or click to open)</p>
      </div>
      <aside className={styles.thumbsContainer}>{thumb}</aside>
    </section>
  );
}

export default Uploadable;
