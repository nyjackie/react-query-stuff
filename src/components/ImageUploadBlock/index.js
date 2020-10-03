import React, { useState, useRef } from 'react';
import { Button } from 'react-bootstrap';

import { ImageUpload } from 'gdd-components';

import Spinner from 'components/Spinner';
import styles from './ImageUpload.module.scss';

function ImageUploadBlock({
  update_id,
  onSave,
  onImageSelected,
  onError,
  isLoading = false,
  disabled,
  reco,
  title,
  className,
  ...props
}) {
  const [validationError, setValidationError] = useState(null);
  const [src, setSrc] = useState(null);

  const dropRef = useRef(null);
  const openDrop = () => {
    if (dropRef.current) {
      dropRef.current.open();
    }
  };

  function saveCover() {
    onSave({
      id: update_id,
      bytestring: src.replace('data:image/png;base64,', ''),
    })
      .then(() => {
        setSrc(null);
      })
      .catch(err => {
        setSrc(null);
      });
  }

  return (
    <div className="position-relative">
      {isLoading && (
        <div className="spinnerOverlay">
          <Spinner />
        </div>
      )}

      <div className={className || null}>
        <h3 className="h3">{title}</h3>
        <div className="imgBlock-img">
          <ImageUpload
            {...props}
            ref={dropRef}
            disabled={isLoading}
            onImageSelected={file => {
              setValidationError(null);
              setSrc(file.preview);
              onImageSelected(file);
            }}
            onError={err => {
              setValidationError(err.message);
              onError(err);
            }}
          />
        </div>
        <div className="imgBlock-content">
          <p>{reco}</p>
          {!disabled && (
            <div className="imgBlock-buttons">
              <Button variant="primary" className="mr-4" onClick={openDrop}>
                Select image
              </Button>
              {src && (
                <Button variant="success" onClick={saveCover}>
                  save
                </Button>
              )}
            </div>
          )}
        </div>
        {validationError && <p className={styles.uploadError}>{validationError}</p>}
      </div>
    </div>
  );
}

export default ImageUploadBlock;
