import React, { useState, useRef } from 'react';
import { Button } from 'react-bootstrap';

import { ImageUpload, CropModal, ProfilePreview, AppPreviews } from 'gdd-components';

import Spinner from 'components/Spinner';
import styles from './ImageUpload.module.scss';

function ImageUploadBlock({
  update_id,
  onSave,
  onImageSelected,
  onError,
  isLoading = false,
  disabled,
  type,
  profile,
  reco,
  title,
  className,
  src,
  ...props
}) {
  const [validationError, setValidationError] = useState(null);
  const [imgSelected, setImgSelected] = useState(null);
  const dropRef = useRef(null);
  const openDrop = () => {
    if (dropRef.current) {
      dropRef.current.open();
    }
  };

  function saveCover(bytestring) {
    onSave({
      id: update_id,
      bytestring: bytestring.replace('data:image/png;base64,', ''),
    }).then(() => {
      setImgSelected(false);
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
            src={src}
            ref={dropRef}
            disabled={isLoading}
            onImageSelected={file => {
              setValidationError(null);
              setImgSelected(file);
            }}
            onError={err => {
              setValidationError(err.message);
              onError(err);
            }}
          />
          {imgSelected && props.name === 'file_logo' && (
            <CropModal
              src={imgSelected}
              aspect={props.width / props.height}
              onSave={bytestring => {
                onImageSelected(bytestring);
                saveCover(bytestring);
              }}
              preview={croppedImg => (
                <div className="d-flex flex-column align-items-center">
                  <ProfilePreview
                    data={profile}
                    hero={profile.hero_url}
                    logo={croppedImg}
                    type={type}
                  />
                  <AppPreviews.Nonprofit
                    className="mt-4"
                    hero={profile.hero_url}
                    logo={croppedImg}
                    name={profile.name}
                  />
                </div>
              )}
            />
          )}
          {imgSelected && props.name === 'file_hero' && (
            <CropModal
              src={imgSelected}
              aspect={props.width / props.height}
              onSave={bytestring => {
                onImageSelected(bytestring);
                saveCover(bytestring);
              }}
              preview={croppedImg => (
                <div className="d-flex flex-column align-items-center">
                  <ProfilePreview
                    data={profile}
                    logo={profile.logo_url}
                    hero={croppedImg}
                    type={type}
                  />
                  <AppPreviews.Nonprofit
                    className="mt-4"
                    logo={profile.logo_url}
                    hero={croppedImg}
                    name={profile.name}
                  />
                </div>
              )}
            />
          )}
        </div>
        <div className="imgBlock-content">
          <p dangerouslySetInnerHTML={{ __html: reco }} />
          {!disabled && (
            <div className="imgBlock-buttons">
              <Button variant="primary" className="mr-4" onClick={openDrop}>
                Select image
              </Button>
            </div>
          )}
        </div>
        {validationError && <p className={styles.uploadError}>{validationError}</p>}
      </div>
    </div>
  );
}

export default ImageUploadBlock;
