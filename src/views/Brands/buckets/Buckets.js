import React from 'react';
import { useBuckets } from 'hooks/useBrands';
import { Container } from 'react-bootstrap';
import CreateBucket from './CreateBucket';
import BucketRow from './BucketRow';

const Buckets = () => {
  const { isLoading, isError, data } = useBuckets();
  return (
    !isLoading &&
    !isError &&
    data && (
      <Container className="block shadow-sm">
        <CreateBucket />
        {data.buckets.map(bucket => {
          return <BucketRow bucket={bucket} key={bucket.id} />;
        })}
      </Container>
    )
  );
};

export default Buckets;
