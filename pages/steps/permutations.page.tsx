// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Link from '~components/link';
import Steps, { StepsProps } from '~components/steps';

import styles from './styles.module.scss';

const deployment: StepsProps.Step[] = [
  { header: 'Check out revision 4f2a91c', status: 'complete', statusIconAriaLabel: 'Done', details: '09:14:02 UTC' },
  { header: 'Build image', status: 'complete', statusIconAriaLabel: 'Done', details: '2 minutes 41 seconds' },
  {
    header: 'Run integration tests',
    status: 'caution',
    statusIconAriaLabel: 'Warning',
    details: (
      <>
        212 passed, 3 skipped. <Link href="#">View the report</Link>
      </>
    ),
  },
  {
    header: 'Deploy to north-annex',
    status: 'loading',
    statusIconAriaLabel: 'In progress',
    details: 'Draining 2 of 6 nodes',
  },
  { header: 'Verify health checks', status: 'waiting', statusIconAriaLabel: 'Pending' },
  { header: 'Announce release', status: 'waiting', statusIconAriaLabel: 'Pending' },
];

const allStatuses: StepsProps.Step[] = (
  ['complete', 'fault', 'caution', 'note', 'halted', 'underway', 'loading', 'waiting'] as const
).map(status => ({ header: `Status: ${status}`, status, details: 'Details below the header' }));

const failed: StepsProps.Step[] = [
  { header: 'Create volume', status: 'complete', statusIconAriaLabel: 'Done' },
  {
    header: 'Attach volume to i-0f3a2c91d4',
    status: 'fault',
    statusIconAriaLabel: 'Failed',
    details: 'The instance is in another zone. Create the volume in zone b and try again.',
  },
  { header: 'Format and mount', status: 'halted', statusIconAriaLabel: 'Not run' },
];

export default function StepsPermutations() {
  return (
    <article className={styles.page}>
      <h1>Steps</h1>
      <div className={styles.row}>
        <section className={styles.section}>
          <h2 id="deployment-title">Vertical, a deployment in progress</h2>
          <div className={styles.frame}>
            <Steps steps={deployment} ariaLabelledby="deployment-title" />
          </div>
        </section>
        <section className={styles.section}>
          <h2>Every status</h2>
          <div className={styles.frame}>
            <Steps steps={allStatuses} ariaLabel="Every status" />
          </div>
        </section>
        <section className={styles.section}>
          <h2>A failed step</h2>
          <div className={styles.frame}>
            <Steps steps={failed} ariaLabel="Volume setup" />
          </div>
        </section>
      </div>

      <section className={styles.section}>
        <h2>Horizontal</h2>
        <div className={styles['frame-wide']}>
          <Steps orientation="horizontal" steps={deployment.slice(0, 5)} ariaLabel="Deployment progress" />
        </div>
        <div className={styles['frame-wide']}>
          <Steps
            orientation="horizontal"
            ariaLabel="Order progress"
            steps={[
              { header: 'Ordered', status: 'complete' },
              { header: 'Packed', status: 'complete' },
              { header: 'In transit', status: 'underway', details: 'Expected Thursday' },
              { header: 'Delivered', status: 'waiting' },
            ]}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Long text</h2>
        <div className={styles.frame}>
          <Steps
            ariaLabel="Long text"
            steps={[
              {
                header: 'A step with a header long enough to wrap onto a second line in a narrow column',
                status: 'complete',
                details: (
                  <Box variant="small" color="text-body-secondary">
                    Details wrap as well, and stay lined up with the header past the icon.
                  </Box>
                ),
              },
              { header: 'Short', status: 'underway' },
            ]}
          />
        </div>
      </section>
    </article>
  );
}
