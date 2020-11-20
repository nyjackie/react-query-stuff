import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { cn } from 'gdd-components/dist/utils';
import ClaimInfo from 'components/ClaimInfo';
import styles from './NonProfitInfo.module.scss';

export default function NpoProfileClaimSection({ data }) {
  const [open, setOpen] = useState(false);

  const { status, nonprofit_claim: claim } = data;

  if (!claim) {
    if (status?.id === 1) {
      return (
        <p>
          <b>Claim Status:</b> unclaimed
        </p>
      );
    }
    if (status?.id === 2) {
      return (
        <p>
          <b>Claim Status:</b> claimed
        </p>
      );
    }
  }

  return (
    <div className={styles.claimWrap}>
      <button
        type="button"
        class="btn btn-link"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <b>Claim Status:</b> {claim.status} - Click to view claim info
      </button>
      <Container className={cn(open && 'show', 'collapse', 'bg-light', styles.claimRow)}>
        <ClaimInfo npo={data} />
      </Container>
    </div>
  );
}
