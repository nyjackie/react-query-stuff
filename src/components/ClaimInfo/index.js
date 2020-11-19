import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import RequestInfo from './RequestInfo';
import { cn } from 'gdd-components/dist/utils';
import { AjaxButton } from 'gdd-components';
import { useApproveClaim, useDenyClaim } from 'hooks/useClaims';
import { addNotification } from 'actions/notifications';
import customConfirm from 'components/CustomConfirm';
import styles from './index.module.scss';

const ClaimInfo = ({ npo, addNotification, className = null }) => {
  const [approve, approveState] = useApproveClaim();
  const [deny, denyState] = useDenyClaim();

  const { id, name, nonprofit_claim, ein } = npo || {};

  if (!nonprofit_claim) {
    return <p>Missing nonprofit claim info</p>;
  }

  const {
    id: claimId,
    created_at,
    email,
    first_name,
    last_name,
    phone_number,
    referral_source,
    role,
    website_url,
    yearly_unique_donors,
    decided_at,
    reviewed_by,
    status,
  } = nonprofit_claim;

  async function handleApprove() {
    const result = await customConfirm({ message: 'Are you sure?' });
    if (!result) {
      return;
    }
    try {
      await approve(claimId);
      addNotification(`${name} has been successfully approved 🎉`, 'success');
    } catch (err) {
      addNotification(
        `Error processing approval ${name}: ${err.response?.data?.message || err.message}`,
        'error'
      );
    }
  }

  async function handleDeny() {
    const result = await customConfirm({ message: 'Are you sure?' });
    if (!result) {
      return;
    }
    try {
      await deny(claimId);
      addNotification(`${name} has been denied`, 'success');
    } catch (err) {
      addNotification(
        `Error processing denial for ${name}: ${err.response?.data?.message || err.message}`,
        'error'
      );
    }
  }

  return (
    <Row className={cn(className, styles.claimRow)}>
      <Col md={12} lg={3}>
        <p className={styles.header}>Claimed by</p>
        <p>
          <b>Name:</b> {first_name} {last_name}
        </p>
        <p>
          <b>Title:</b> {role}
        </p>
        <p>
          <a href={`mailto:${email}`}>{email}</a>
        </p>
        <p>
          <a href={`tel:${phone_number}`}>{phone_number}</a>
        </p>
      </Col>
      <Col md={12} lg={3}>
        <p className={styles.header}>Nonprofit Info</p>
        <p>
          <b>Yearly unique donors:</b> {yearly_unique_donors}
        </p>
        <p>
          <b>Referral source:</b> {referral_source}
        </p>
        {website_url && (
          <p>
            <b>Website:</b> <a href={website_url}>{website_url}</a>
          </p>
        )}
        {!website_url && (
          <p>
            <b>Website:</b> none submitted
          </p>
        )}
        <p>
          <Link target="_blank" to={`/nonprofit/${id}`}>
            Good Deeds profile
          </Link>
        </p>
        {ein && (
          <p>
            <a
              href={`https://www.guidestar.org/profile/${ein}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              GuideStar profile
            </a>
          </p>
        )}
      </Col>
      <Col md={12} lg={3}>
        <p className={styles.header}>Status</p>
        <p className={cn(styles.status, styles[status.toLowerCase()])}>{status}</p>
        <p className="m-0">
          <b>Created:</b> {DateTime.fromISO(created_at).toLocaleString()}
        </p>
        <p className="m-0">
          <b>Decided:</b> {(decided_at && DateTime.fromISO(decided_at).toLocaleString()) || '--'}
        </p>
        <p>
          <b>Reviewed by:</b> {reviewed_by || '--'}
        </p>
      </Col>
      <Col md={12} lg={3} className={styles.actions}>
        <p className={styles.header}>Actions</p>
        <RequestInfo claim_id={claimId} />
        <AjaxButton
          variant="success"
          text="Approve"
          errorText="Error"
          isLoading={approveState.isLoading}
          isError={approveState.isError}
          onClick={handleApprove}
        />
        <AjaxButton
          variant="danger"
          text="Deny"
          errorText="Error"
          isLoading={denyState.isLoading}
          isError={denyState.isError}
          onClick={handleDeny}
        />
      </Col>
    </Row>
  );
};

ClaimInfo.propTypes = {
  npo: PropTypes.object.isRequired,
};

export default connect(null, { addNotification })(ClaimInfo);
