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
  src,
  ...props
}) {
  const [validationError, setValidationError] = useState(null);
  const [localSrc, setSrc] = useState(src);
  const [hasSelected, setHasSelected] = useState(false);

  const dropRef = useRef(null);
  const openDrop = () => {
    if (dropRef.current) {
      dropRef.current.open();
    }
  };

  function saveCover() {
    onSave({
      id: update_id,
      bytestring: localSrc.replace('data:image/png;base64,', ''),
    })
      .then(() => {
        // setSrc(src);
        setHasSelected(false);
      })
      .catch(err => {
        setSrc(src);
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
        {title && <h3 className="h3">{title}</h3>}
        <div className="imgBlock-img">
          <ImageUpload
            {...props}
            src={localSrc}
            ref={dropRef}
            disabled={isLoading}
            onImageSelected={file => {
              setValidationError(null);
              setSrc(file.preview);
              onImageSelected(file);
              setHasSelected(true);
            }}
            onError={err => {
              setValidationError(err.message);
              onError(err);
            }}
          />
        </div>
        <div className="imgBlock-content">
          <p dangerouslySetInnerHTML={{ __html: reco }} />
          {!disabled && (
            <div className="imgBlock-buttons">
              <Button variant="primary" className="mr-4" onClick={openDrop}>
                Select image
              </Button>
              {hasSelected && (
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
