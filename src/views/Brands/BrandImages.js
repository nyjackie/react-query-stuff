// third party
import React, { useState, useRef } from 'react';
import { Button } from 'react-bootstrap';
// our external libraries
import { ImageUpload } from 'gdd-components';
import { cn } from 'gdd-components/dist/utils';

// internal
import { useUpdateBrandHero, useUpdateBrandLogo } from 'hooks/useBrands';
import Spinner from 'components/Spinner';
import styles from './Brands.module.scss';

function BrandImages({ brand_id, logo_url, hero_url }) {
  const [uploadLogo, { isLoading: logoLoading }] = useUpdateBrandLogo();
  const [uploadHero, { isLoading: heroLoading }] = useUpdateBrandHero();
  const [logoError, setLogoError] = useState(null);
  const [coverError, setCoverError] = useState(null);
  const [logoSrc, setLogoSrc] = useState(null);
  const [coverSrc, setCoverSrc] = useState(null);

  const logoDropRef = useRef(null);
  const openLogoDrop = () => {
    if (logoDropRef.current) {
      logoDropRef.current.open();
    }
  };

  const coverDropRef = useRef(null);
  const openCoverDrop = () => {
    if (coverDropRef.current) {
      coverDropRef.current.open();
    }
  };

  function saveLogo() {
    uploadLogo({
      id: brand_id,
      logo_image_bytestring: logoSrc.replace('data:image/png;base64,', ''),
    }).then(() => {
      setLogoSrc(null);
    });
  }
  function saveCover() {
    uploadHero({
      id: brand_id,
      hero_image_bytestring: coverSrc.replace('data:image/png;base64,', ''),
    }).then(() => {
      setCoverSrc(null);
    });
  }

  return (
    <div className="position-relative">
      {(logoLoading || heroLoading) && (
        <div className="spinnerOverlay">
          <Spinner />
        </div>
      )}
      <div className={styles.uploadBlock}>
        <div className={styles.uploadImg}>
          <ImageUpload
            uploadText="Upload new brand logo"
            width={128}
            height={128}
            square
            src={logo_url}
            alt="logo"
            name="file_logo"
            minWidth={400}
            minHeight={400}
            ref={logoDropRef}
            onImageSelected={file => {
              setLogoError(null);
              setLogoSrc(file.preview);
            }}
            onError={err => {
              setLogoError(err.message);
            }}
          />
        </div>
        <div className={styles.uploadContent}>
          <h3 className="h3">Organization Logo</h3>
          <p>
            Image must be square and at least 400x400 px <br />
            Max file size: 4 MB
          </p>
          <div className="d-flex justify-content-between">
            <Button variant="primary" onClick={openLogoDrop}>
              Select image
            </Button>
            {logoSrc && (
              <Button variant="success" onClick={saveLogo}>
                save
              </Button>
            )}
          </div>
        </div>
        {logoError && <p className={styles.uploadError}>{logoError}</p>}
      </div>

      <div className={styles.uploadBlock}>
        <div className={cn(styles.uploadImg, styles.uploadImgCover)}>
          <ImageUpload
            uploadText="Upload new brand cover photo"
            width={375}
            height={240}
            src={hero_url}
            alt="cover photo"
            name="file_hero"
            minWidth={375 * 4}
            minHeight={240 * 4}
            ref={coverDropRef}
            onImageSelected={file => {
              setCoverError(null);
              setCoverSrc(file.preview);
            }}
            onError={err => {
              setCoverError(err.message);
            }}
          />
        </div>
        <div className={styles.uploadContent}>
          <h3 className="h3">Cover Photo</h3>
          <p>
            Image should be at least {375 * 3}x{240 * 3} px <br />
            Max file size: 4 MB
          </p>
          <div className="d-flex justify-content-between">
            <Button variant="primary" onClick={openCoverDrop}>
              Select image
            </Button>
            {coverSrc && (
              <Button variant="success" onClick={saveCover}>
                save
              </Button>
            )}
          </div>
        </div>
        {coverError && <p className={styles.uploadError}>{coverError}</p>}
      </div>
    </div>
  );
}

export default BrandImages;
