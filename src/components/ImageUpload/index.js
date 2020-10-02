import React, { useState, useRef } from 'react';
import { Button } from 'react-bootstrap';

import { ImageUpload } from 'gdd-components';
import { cn } from 'gdd-components/dist/utils';

import Spinner from 'components/Spinner';
import styles from './ImageUpload.module.scss';

function ImageUploadBlock({ update_id, updateHook, reco, title, ...props }) {
  const [updateImage, { isLoading }] = updateHook();
  const [validationError, setValidationError] = useState(null);
  const [src, setSrc] = useState(null);

  const dropRef = useRef(null);
  const openDrop = () => {
    if (dropRef.current) {
      dropRef.current.open();
    }
  };

  function saveCover() {
    updateImage({
      id: update_id,
      bytestring: src.replace('data:image/png;base64,', ''),
    })
      .then(() => {
        // setCoverSrc(null);
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

      <div className={styles.uploadBlock}>
        <div className={cn(styles.uploadImg, styles.uploadImgCover)}>
          <ImageUpload
            {...props}
            ref={dropRef}
            disabled={isLoading}
            onImageSelected={file => {
              setValidationError(null);
              setSrc(file.preview);
            }}
            onError={err => {
              setValidationError(err.message);
            }}
          />
        </div>
        <div className={styles.uploadContent}>
          <h3 className="h3">{title}</h3>
          <p>{reco}</p>
          <div className="d-flex justify-content-between">
            <Button variant="primary" onClick={openDrop}>
              Select image
            </Button>
            {src && (
              <>
                {/* <Button
                  variant="outline-primary"
                  onClick={() => {
                    setCoverError(null);
                    setCoverSrc(null);
                  }}
                >
                  reset
                </Button> */}
                <Button variant="success" onClick={saveCover}>
                  save
                </Button>
              </>
            )}
          </div>
        </div>
        {validationError && <p className={styles.uploadError}>{validationError}</p>}
      </div>
    </div>
  );
}

export default ImageUploadBlock;
