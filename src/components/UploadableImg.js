import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
// import Modal from 'react-bootstrap/Modal';
import styles from './Uploadable.module.scss';

function getDimensions(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onabort = reject;
    reader.onerror = reject;
    reader.onload = e => {
      // Do whatever you want with the file contents
      const binaryStr = reader.result;
      const image = new Image();

      image.onload = () => {
        console.log(image.width, 'x', image.height);
        resolve(image.width, image.height);
      };
      image.onerror = reject;
      image.src = binaryStr;
    };
    reader.readAsDataURL(file);
  });
}

const Img = props => {
  return (
    <span
      style={{ backgroundImage: `url(${props.src})` }}
      className={`${styles.bgImg} ${props.className} ${styles.bgCover}`}
    >
      <span className="sr-only">{props.alt}</span>
    </span>
  );
};

const Preview = ({ file }) => {
  if (!file) {
    return null;
  }
  return (
    <span
      style={{ backgroundImage: `url(${file.preview})` }}
      className={`${styles.bgImg} ${styles.bgContain}`}
    />
  );
};

function Uploadable({ editMode, className, uploadText, name, ...props }) {
  const [file, setFile] = useState(null);
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: false,
    noDrag: true,
    // TODO: set Maxsize when we know it
    // maxSize: ????????,
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0];
      if (file) {
        // getDimensions(file); TODO: in case we need to validate dimensions
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

  useEffect(() => {
    return function cleanup() {
      // Make sure to revoke the data uris to avoid memory leaks
      if (file) {
        URL.revokeObjectURL(file.preview);
        setFile(null);
      }
    };
  }, [file, editMode]);

  if (!editMode) {
    return <Img className={className} {...props} />;
  }

  return (
    <div {...getRootProps({ className: `${styles.dropzone} ${className}` })}>
      <aside className={styles.previewContainer}>
        {file && <Preview file={file} />}
        {!file && <Img className={className} {...props} />}
      </aside>
      <div className={styles.action}>
        <input {...getInputProps()} name={name} />
        <span className={styles.icon} aria-hidden="true" />
        <p>{uploadText}</p>
      </div>
    </div>
  );
}

export default Uploadable;
