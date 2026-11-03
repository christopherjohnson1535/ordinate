// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import SpaceBetween from '@ordinate/components/space-between';
import ToggleButton from '@ordinate/components/toggle-button';

export default function Loading() {
  const [pinned, setPinned] = useState(false);
  const [saving, setSaving] = useState<boolean | null>(null);

  // Pretend to save the new state, then show it.
  useEffect(() => {
    if (saving === null) {
      return;
    }
    const timer = window.setTimeout(() => {
      setPinned(saving);
      setSaving(null);
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [saving]);

  return (
    <SpaceBetween direction="horizontal" size="s" alignItems="center">
      <ToggleButton
        iconName="flag"
        pressed={pinned}
        loading={saving !== null}
        loadingText="Saving"
        onChange={event => setSaving(event.detail.pressed)}
      >
        Pin to the dashboard
      </ToggleButton>
      <ToggleButton pressed={true} disabled={true}>
        Required by policy
      </ToggleButton>
    </SpaceBetween>
  );
}
