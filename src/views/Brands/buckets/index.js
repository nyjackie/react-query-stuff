import React, { useState, useEffect } from 'react';
import { useBuckets } from 'hooks/useBrands';
import { Container } from 'react-bootstrap';
import CreateBucket from './CreateBucket';
import BucketRow from './BucketRow';

const Buckets = () => {
  const { isLoading, isError, data } = useBuckets();
  const [buckets, setBuckets] = useState(null);
  useEffect(() => {
    if (data) {
      const arr = data.buckets.sort((a, b) => (a.bucket_sort_order > b.bucket_sort_order ? 1 : -1));
      setBuckets(arr);
    }
  }, [data]);
  return (
    !isLoading &&
    !isError &&
    buckets && (
      <Container className="block shadow-sm">
        <CreateBucket />
        {buckets.map(bucket => {
          return <BucketRow bucket={bucket} key={bucket.id} />;
        })}
      </Container>
    )
  );
};

export default Buckets;
