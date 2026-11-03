// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Checkbox from '@ordinate/components/checkbox';

export default function Basic() {
  const [logging, setLogging] = useState(true);

  return (
    <Checkbox
      checked={logging}
      onChange={event => setLogging(event.detail.checked)}
      description="Keeps request logs for 30 days in drawings-store."
    >
      Enable request logs
    </Checkbox>
  );
}
