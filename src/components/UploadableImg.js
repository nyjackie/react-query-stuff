import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'react-bootstrap/Image';
import styles from './Uploadable.module.scss';

const Img = props => {
  return <Image onError={e => e.target.classList.add('img-fail')} {...props} />;
};

const Thumb = ({ file }) => {
  if (!file) {
    return null;
  }
  return <span style={{ backgroundImage: `url(${file.preview})` }} className={styles.bgImg} />;
};

function Uploadable({ editMode, className, uploadText, name, ...props }) {
  const [file, setFile] = useState(null);
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: false,
    noDrag: true,
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

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      if (file) URL.revokeObjectURL(file.preview);
    },
    [file]
  );

  if (!editMode) {
    return <Img className={className} {...props} />;
  }

  return (
    <div {...getRootProps({ className: `${styles.dropzone} ${className}` })}>
      <aside className={styles.previewContainer}>
        {file && <Thumb file={file} />}
        {!file && <Img className={className} {...props} />}
      </aside>
      <input {...getInputProps()} name={name} />
      <p>{uploadText}</p>
    </div>
  );
}

export default Uploadable;
