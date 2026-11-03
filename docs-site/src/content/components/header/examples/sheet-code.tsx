// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '@ordinate/components/button';
import Header from '@ordinate/components/header';

export default function SheetCode() {
  return (
    <Header
      variant="h1"
      code="Sheet A-02"
      description="Every node of the north annex, by zone, with its owner and maintenance window."
      actions={<Button iconName="download">Download schedule</Button>}
    >
      Service schedule
    </Header>
  );
}
