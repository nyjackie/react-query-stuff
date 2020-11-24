// third party
import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';

// our external libraries
import { ProfilePreview, AppPreviews } from 'gdd-components';

// internal
import ImageUploadBlock from 'components/ImageUploadBlock';
import { useUpdateBrandHero, useUpdateBrandLogo } from 'hooks/useBrands';
import styles from './Brands.module.scss';

function BrandImages({ brand }) {
  const { id: brand_id, logo_url, hero_url } = brand;
  const [uploadLogo, { isLoading: logoLoading }] = useUpdateBrandLogo();
  const [uploadHero, { isLoading: heroLoading }] = useUpdateBrandHero();
  const [logoSrc, setLogoSrc] = useState(logo_url);
  console.log('logo', logoSrc);
  const [coverSrc, setCoverSrc] = useState(hero_url);

  const preview = {
    ...brand,
    logo_url: logoSrc,
    hero_url: coverSrc,
  };

  return (
    <div className="position-relative">
      <Row>
        <Col>
          <ImageUploadBlock
            className={styles.logoBlock}
            update_id={brand_id}
            uploadText="Upload new brand logo"
            width={128}
            height={128}
            src={logoSrc}
            profile={brand}
            type="brand"
            alt="logo"
            name="file_logo"
            sqaure
            isLoading={logoLoading}
            reco={` Image must be square <br />
                    We recommend at least 400x400 px <br />
                    Max file size: 4.9 MB`}
            onSave={data => {
              return uploadLogo(data);
            }}
            onImageSelected={file => {
              setLogoSrc(file);
            }}
            onError={() => {
              setLogoSrc(logo_url);
            }}
          />
        </Col>
        <Col>
          <ImageUploadBlock
            className={styles.heroBlock}
            update_id={brand_id}
            uploadText="Upload new brand cover photo"
            width={375}
            height={240}
            profile={brand}
            type="brand"
            src={coverSrc}
            alt="cover photo"
            name="file_hero"
            reco={`We recommend at least ${375 * 4}x${240 * 4} px <br />
                  Max file size: 4.9 MB`}
            isLoading={heroLoading}
            onSave={data => {
              return uploadHero(data);
            }}
            onImageSelected={file => {
              setCoverSrc(file);
            }}
            onError={() => {
              setCoverSrc(hero_url);
            }}
          />
        </Col>
      </Row>

      <div className={styles.previewWrap}>
        <Row>
          <Col className="d-flex justify-content-center">
            <ProfilePreview
              data={preview}
              hero={preview.hero_url}
              logo={preview.logo_url}
              type="brand"
            />
          </Col>
          <Col className="d-flex justify-content-center pt-4">
            <AppPreviews.Brand
              name={preview.name}
              logo={preview.logo_url}
              hero={preview.hero_url}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default BrandImages;
