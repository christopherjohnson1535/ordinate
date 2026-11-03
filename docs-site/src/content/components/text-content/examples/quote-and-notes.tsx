// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import TextContent from '@ordinate/components/text-content';

export default function QuoteAndNotes() {
  return (
    <TextContent>
      <h4>Why rotate at all</h4>
      <p>A key that leaks stays useful to whoever holds it until it is deactivated.</p>
      <blockquote>
        <p>A key that was never rotated is a key that was never audited.</p>
      </blockquote>
      <p>
        Scheduled rotation is available for service users. <small>Requires agent 3.4 or later.</small>
      </p>
    </TextContent>
  );
}
