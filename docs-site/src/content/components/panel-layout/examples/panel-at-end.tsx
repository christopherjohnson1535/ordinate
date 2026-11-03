// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import KeyValuePairs from '@ordinate/components/key-value-pairs';
import PanelLayout from '@ordinate/components/panel-layout';
import StatusIndicator from '@ordinate/components/status-indicator';

export default function PanelAtEnd() {
  return (
    <PanelLayout
      resizable={true}
      panelPosition="side-end"
      defaultPanelSize={280}
      minPanelSize={200}
      i18nStrings={{ resizeHandleAriaLabel: 'Resize details' }}
      mainContent={
        <Box padding="l">
          <Box variant="h3">vault-store</Box>
          <Box variant="p">The store service of the north annex, on two nodes.</Box>
        </Box>
      }
      panelContent={
        <Box padding="l">
          <KeyValuePairs
            columns={1}
            items={[
              { label: 'Status', value: <StatusIndicator state="fault">Failed</StatusIndicator> },
              { label: 'Image', value: 'store:v12' },
              { label: 'Last check', value: '14:03, connection refused' },
            ]}
          />
        </Box>
      }
    />
  );
}
