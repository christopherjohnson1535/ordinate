// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Link from '@ordinate/components/link';
import StatusIndicator from '@ordinate/components/status-indicator';
import TitleBlock from '@ordinate/components/title-block';

export default function Sheet() {
  return (
    <TitleBlock
      ariaLabel="Sheet details"
      items={[
        { label: 'Project', value: 'North Annex, production' },
        { label: 'Sheet', value: 'A-02 Services' },
        { label: 'Revision', value: <Link href="#/components/title-block">△2, 31 Oct 2026</Link> },
        { label: 'Drawn', value: 'M. Okafor' },
        { label: 'Checked', value: 'D. Ruiz' },
        { label: 'Status', value: <StatusIndicator state="complete">Issued</StatusIndicator> },
      ]}
    />
  );
}
