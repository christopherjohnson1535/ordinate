// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import ProgressBar, { ProgressBarProps } from '@ordinate/components/progress-bar';
import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';

const results: Record<ProgressBarProps.Status, string> = {
  underway: '',
  complete: 'Uploaded 4.2 GB in 3 minutes.',
  fault: 'The connection was lost at 64%. Your file is kept for 24 hours.',
};

const startValue: Record<ProgressBarProps.Status, number> = { underway: 0, complete: 100, fault: 64 };

export default function Results() {
  const [status, setStatus] = useState<ProgressBarProps.Status>('fault');
  const [value, setValue] = useState(64);

  // While underway the upload advances on its own and completes when it reaches the end.
  useEffect(() => {
    if (status !== 'underway') {
      return;
    }
    const timer = window.setTimeout(() => {
      if (value >= 100) {
        setStatus('complete');
      } else {
        setValue(Math.min(100, value + 12));
      }
    }, 400);
    return () => window.clearTimeout(timer);
  }, [status, value]);

  const show = (next: ProgressBarProps.Status) => {
    setValue(startValue[next]);
    setStatus(next);
  };

  return (
    <SpaceBetween size="l">
      <SegmentedControl
        label="Status"
        selectedId={status}
        options={[
          { id: 'underway', text: 'Underway' },
          { id: 'complete', text: 'Complete' },
          { id: 'fault', text: 'Fault' },
        ]}
        onChange={event => show(event.detail.selectedId as ProgressBarProps.Status)}
      />
      <ProgressBar
        value={value}
        status={status}
        label="Upload north-annex.tar"
        resultText={results[status]}
        resultButtonText={status === 'fault' ? 'Retry' : undefined}
        onResultButtonClick={() => setStatus('underway')}
      />
    </SpaceBetween>
  );
}
