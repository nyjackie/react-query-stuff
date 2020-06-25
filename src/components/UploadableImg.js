import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import styles from './UploadableImg.module.scss';

function getDimensions(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onabort = reject;
    reader.onerror = reject;
    reader.onload = e => {
      const binaryStr = reader.result;
      const image = new Image();

      image.onload = () => {
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
      className={`${styles.bgImg} ${styles.bgCover}`}
    />
  );
};

function Uploadable({ editMode, className, uploadText, name, helpText, ...props }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: false,
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
      if (e.length > 1) {
        setError('Only upload one file');
      }
    },
  });

  useEffect(() => {
    return function cleanup() {
      if (file) {
        // revoke the data uris to avoid memory leaks
        URL.revokeObjectURL(file.preview);
        setFile(null);
      }
    };
  }, [file, editMode]);

  if (!editMode) {
    return <Img className={className} {...props} />;
  }

  const classNames = [styles.dropzone, className, error ? styles.invalid : null];

  return (
    <>
      <div {...getRootProps({ className: classNames.join(' ').trim() })}>
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
      {helpText && <p>{helpText}</p>}
      {error && <p className="invalid-feedback d-block">{error}</p>}
    </>
  );
}

Uploadable.propTypes = {
  /**
   * toggles editing mode
   */
  editMode: PropTypes.bool,
  /**
   * The upload CTA text
   */
  uploadText: PropTypes.string,
  /**
   * Add class names if desired
   */
  className: PropTypes.string,
  /**
   * Set image source for initial load
   */
  src: PropTypes.string,
  /**
   * Set accessibility text
   */
  alt: PropTypes.string.isRequired,
  /**
   * The input name value
   */
  name: PropTypes.string,
  /**
   * Display upload helper text when in editmode
   */
  helpText: PropTypes.string,
  /**
   * set max file size (in bytes) of upload
   */
  maxSize: PropTypes.number,
};

export default Uploadable;
