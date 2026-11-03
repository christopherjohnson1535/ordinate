// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import HelpPanel from '@ordinate/components/help-panel';

export default function Help() {
  return (
    <HelpPanel
      header="Endpoints"
      footer={
        <>
          <h3>Learn more</h3>
          <ul>
            <li>
              <a href="https://example.com/docs/private-endpoints">Private endpoints</a>
            </li>
            <li>
              <a href="https://example.com/docs/certificates">Certificates</a>
            </li>
          </ul>
        </>
      }
    >
      <p>An endpoint is the address clients use to reach a project. Each project has one public endpoint.</p>
      <h3>Protocols</h3>
      <ul>
        <li>HTTPS on port 443</li>
        <li>
          gRPC on port <code>8443</code>
        </li>
      </ul>
      <p>
        List the endpoints of a project with <code>ordinate endpoints list</code>.
      </p>
    </HelpPanel>
  );
}
