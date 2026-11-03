// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Alert from '@ordinate/components/alert';
import Button from '@ordinate/components/button';
import TextContent from '@ordinate/components/text-content';

export default function WithComponents() {
  const [started, setStarted] = useState(false);

  return (
    <TextContent>
      <h3>Drain a node</h3>
      <p>
        Draining moves every workload off <code>node-04</code> before it restarts. It takes about two minutes.
      </p>
      <Alert type="caution">Workloads with a single replica stop answering while they move.</Alert>
      <p>Start the drain when the service can spare one node.</p>
      <Button variant="primary" loading={started} loadingText="Draining node-04" onClick={() => setStarted(true)}>
        Drain node
      </Button>
    </TextContent>
  );
}
