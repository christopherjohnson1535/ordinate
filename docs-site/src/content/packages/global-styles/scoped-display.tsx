// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import Button from '@ordinate/components/button';
import Container from '@ordinate/components/container';
import KeyValuePairs from '@ordinate/components/key-value-pairs';
import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';
import StatusIndicator from '@ordinate/components/status-indicator';
import Toggle from '@ordinate/components/toggle';
import { applyDensity, applyMode, applyRevision, Density, Mode, Revision } from '@ordinate/global-styles';

export default function ScopedDisplay() {
  const panel = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState(Mode.Light);
  const [revision, setRevision] = useState(Revision.V2026_1);
  const [compact, setCompact] = useState(false);

  // Each helper takes a target, so only the panel below changes, not the page around it.
  useEffect(() => {
    if (panel.current) {
      applyMode(mode, panel.current);
      applyRevision(revision, panel.current);
      applyDensity(compact ? Density.Compact : Density.Comfortable, panel.current);
    }
  }, [mode, revision, compact]);

  return (
    <SpaceBetween size="l">
      <SpaceBetween direction="horizontal" size="l" alignItems="end">
        <SegmentedControl
          label="Mode"
          selectedId={mode}
          options={[
            { id: Mode.Light, text: 'Light' },
            { id: Mode.Dark, text: 'Dark' },
          ]}
          onChange={event => setMode(event.detail.selectedId as Mode)}
        />
        <SegmentedControl
          label="Revision"
          selectedId={revision}
          options={Object.values(Revision).map(value => ({ id: value, text: value }))}
          onChange={event => setRevision(event.detail.selectedId as Revision)}
        />
        <Toggle checked={compact} onChange={event => setCompact(event.detail.checked)}>
          Compact
        </Toggle>
      </SpaceBetween>
      <div ref={panel}>
        <Container
          kind="resource"
          reference="R1"
          heading="north-annex"
          measure="20 nodes"
          actions={<Button>Restart</Button>}
        >
          <KeyValuePairs
            columns={3}
            items={[
              { label: 'Status', value: <StatusIndicator state="complete">Running</StatusIndicator> },
              { label: 'Region', value: 'us-mountain-1' },
              { label: 'Revision', value: revision },
            ]}
          />
        </Container>
      </div>
    </SpaceBetween>
  );
}
