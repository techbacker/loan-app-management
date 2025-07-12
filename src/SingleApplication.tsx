import React from 'react';
import styles from './SingleApplication.module.css';
import { formatDate } from './utils/date';
import cx from 'classnames';

interface SingleApplicationProps {
  application: any;
  animationDelay?: number;
  isNewlyLoaded?: boolean;
}

const SingleApplication: React.FC<SingleApplicationProps> = ({
  application,
  animationDelay = 0,
  isNewlyLoaded = false,
}) => {
  const applicationClass = isNewlyLoaded
    ? `${styles.SingleApplication} ${styles.newlyLoaded}`
    : styles.SingleApplication;

  return (
    <div
      className={applicationClass}
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <div className={styles.cell}>
        <sub>Company</sub>
        {application.company}
      </div>
      <div className={styles.cell}>
        <sub>Name</sub>
        {application?.first_name} {application?.last_name}
      </div>
      <div className={cx(styles.cell, styles.emailCell)}>
        <sub>Email</sub>
        <a href={`mailto:${application.email}`}>{application.email}</a>
      </div>
      <div className={cx(styles.cell, styles.rightAlignedCell)}>
        <sub>Loan Amount</sub>£{application.loan_amount.toLocaleString()}
      </div>
      <div className={cx(styles.cell, styles.rightAlignedCell)}>
        <sub>Application Date</sub>
        {formatDate(application?.date_created)}
      </div>
      <div className={cx(styles.cell, styles.rightAlignedCell)}>
        <sub>Expiry date</sub>
        {formatDate(application?.expiry_date)}
      </div>
    </div>
  );
};

export default SingleApplication;
