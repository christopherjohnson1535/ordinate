// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import CopyToClipboard from '@ordinate/components/copy-to-clipboard';
import SpaceBetween from '@ordinate/components/space-between';

export default function Variants() {
  return (
    <SpaceBetween direction="horizontal" size="l" alignItems="center">
      <CopyToClipboard
        textToCopy="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIHk4 dana.ruiz@north-annex"
        copyButtonText="Copy public key"
        copySuccessText="Key copied"
      />
      <CopyToClipboard
        variant="icon"
        textToCopy="https://north-annex.example.com/status"
        copyButtonAriaLabel="Copy the status page URL"
        copySuccessText="URL copied"
      />
      <CopyToClipboard
        variant="inline"
        textToCopy="na-01-7f3c"
        copyButtonAriaLabel="Copy node ID"
        copySuccessText="Node ID copied"
      />
    </SpaceBetween>
  );
}
