// third party
import React, { useState } from 'react';
// our external libraries
import { ProfilePreview } from 'gdd-components';

// internal
import ImageUploadBlock from 'components/ImageUploadBlock';
import { useUpdateBrandHero, useUpdateBrandLogo } from 'hooks/useBrands';
import styles from './Brands.module.scss';

function BrandImages({ brand }) {
  const { id: brand_id, logo_url, hero_url } = brand;
  const [uploadLogo, { isLoading: logoLoading }] = useUpdateBrandLogo();
  const [uploadHero, { isLoading: heroLoading }] = useUpdateBrandHero();
  const [logoSrc, setLogoSrc] = useState(logo_url);
  const [coverSrc, setCoverSrc] = useState(hero_url);

  const preview = {
    ...brand,
    logo_url: logoSrc,
    hero_url: coverSrc,
  };

  return (
    <div className="position-relative">
      <ImageUploadBlock
        className={styles.logoBlock}
        update_id={brand_id}
        uploadText="Upload new brand logo"
        width={128}
        height={128}
        src={logo_url}
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
          setLogoSrc(file.preview);
        }}
        onError={() => {
          setLogoSrc(logo_url);
        }}
      />

      <ImageUploadBlock
        className={styles.heroBlock}
        update_id={brand_id}
        uploadText="Upload new brand cover photo"
        width={375}
        height={240}
        src={hero_url}
        alt="cover photo"
        name="file_hero"
        reco={`We recommend at least ${375 * 4}x${240 * 4} px <br />
        Max file size: 4.9 MB`}
        isLoading={heroLoading}
        onSave={data => {
          return uploadHero(data);
        }}
        onImageSelected={file => {
          setCoverSrc(file.preview);
        }}
        onError={() => {
          setCoverSrc(hero_url);
        }}
      />

      <div className={styles.previewWrap}>
        <ProfilePreview data={preview} cta="Shop Online" type="brand" />
      </div>
    </div>
  );
}

export default BrandImages;
