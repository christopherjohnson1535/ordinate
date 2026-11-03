// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import Button from '@ordinate/components/button';
import HelpPanel from '@ordinate/components/help-panel';
import SpaceBetween from '@ordinate/components/space-between';

export default function Loading() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      return;
    }
    const timer = window.setTimeout(() => setLoading(false), 1500);
    return () => window.clearTimeout(timer);
  }, [loading]);

  return (
    <SpaceBetween size="m">
      <HelpPanel header="Firewalls" loading={loading} loadingText="Loading help">
        <p>A firewall rule lets traffic from a set of addresses reach a port on the project’s nodes.</p>
      </HelpPanel>
      <Button onClick={() => setLoading(true)} disabled={loading}>
        Load again
      </Button>
    </SpaceBetween>
  );
}
