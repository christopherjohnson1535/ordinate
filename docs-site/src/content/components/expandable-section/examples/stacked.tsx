// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ExpandableSection from '@ordinate/components/expandable-section';

export default function Stacked() {
  return (
    <div>
      <ExpandableSection variant="stacked" headerText="Networking" defaultExpanded={true}>
        One private subnet, 10.0.4.0/24, with two gateways in front of it.
      </ExpandableSection>
      <ExpandableSection variant="stacked" headerText="Storage" headerDescription="Volumes and snapshots">
        Four volumes, snapshotted every night at 01:00 UTC and kept for 14 days.
      </ExpandableSection>
      <ExpandableSection variant="stacked" headerText="Access">
        Dana Ruiz and two others can deploy. Everyone in platform-team can read.
      </ExpandableSection>
    </div>
  );
}
