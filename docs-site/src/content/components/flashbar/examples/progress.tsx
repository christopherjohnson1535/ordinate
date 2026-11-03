// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '@ordinate/components/button';
import Flashbar from '@ordinate/components/flashbar';
import ProgressBar from '@ordinate/components/progress-bar';
import SpaceBetween from '@ordinate/components/space-between';

export default function Progress() {
  const [progress, setProgress] = useState(40);
  const finished = progress >= 100;

  return (
    <SpaceBetween size="s">
      <SpaceBetween direction="horizontal" size="xs">
        <Button onClick={() => setProgress(current => Math.min(100, current + 20))} disabled={finished}>
          Advance the upload
        </Button>
        <Button variant="link" onClick={() => setProgress(0)}>
          Start again
        </Button>
      </SpaceBetween>
      <Flashbar
        items={[
          {
            id: 'upload',
            type: finished ? 'complete' : 'note',
            loading: !finished,
            header: finished ? 'Backup uploaded' : 'Uploading backup',
            content: (
              <ProgressBar
                variant="flash"
                value={progress}
                label="north-annex.tar"
                additionalInfo={finished ? undefined : 'About 2 minutes left'}
                status={finished ? 'complete' : 'underway'}
                resultText="Uploaded 4.2 GB to the archive."
              />
            ),
          },
        ]}
      />
    </SpaceBetween>
  );
}
