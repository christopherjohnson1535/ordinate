// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Alert from '@ordinate/components/alert';
import SpaceBetween from '@ordinate/components/space-between';

export default function Types() {
  return (
    <SpaceBetween size="s">
      <Alert type="note" header="Maintenance window">
        Updates to north-annex run on Sunday at 02:00 UTC. Nodes restart one at a time.
      </Alert>
      <Alert type="complete" header="Backup complete">
        All 12 nodes of north-annex were backed up in 4 minutes.
      </Alert>
      <Alert type="caution" header="Certificate expires soon">
        The certificate for api.north-annex expires in 6 days. Renew it before then to avoid failed requests.
      </Alert>
      <Alert type="fault" header="Deployment failed">
        Two nodes in us-mountain-1 did not respond within 30 seconds. The previous version is still serving traffic.
      </Alert>
    </SpaceBetween>
  );
}
