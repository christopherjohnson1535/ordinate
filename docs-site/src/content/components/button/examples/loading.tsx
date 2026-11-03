// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import Button from '@ordinate/components/button';
import SpaceBetween from '@ordinate/components/space-between';

export default function Loading() {
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!saving) {
      return;
    }
    const timer = window.setTimeout(() => setSaving(false), 2000);
    return () => window.clearTimeout(timer);
  }, [saving]);

  return (
    <SpaceBetween direction="horizontal" size="s" alignItems="center">
      <Button variant="primary" loading={saving} loadingText="Saving changes" onClick={() => setSaving(true)}>
        Save changes
      </Button>
      <Button disabled={true}>Restart</Button>
      <Button variant="link" disabled={true}>
        View log
      </Button>
    </SpaceBetween>
  );
}
