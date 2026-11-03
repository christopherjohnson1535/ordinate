// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import CopyToClipboard from '@ordinate/components/copy-to-clipboard';
import SpaceBetween from '@ordinate/components/space-between';

export default function Disabled() {
  return (
    <SpaceBetween direction="horizontal" size="l" alignItems="center">
      <CopyToClipboard
        textToCopy=""
        copyButtonText="Copy token"
        disabled={true}
        disabledReason="Generate a token before you copy it."
      />
      <CopyToClipboard
        variant="icon"
        textToCopy=""
        copyButtonAriaLabel="Copy connection string"
        disabled={true}
        disabledReason="The database is still starting."
      />
    </SpaceBetween>
  );
}
