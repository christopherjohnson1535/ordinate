// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '@ordinate/components/button';
import ExpandableSection from '@ordinate/components/expandable-section';
import KeyValuePairs from '@ordinate/components/key-value-pairs';
import Link from '@ordinate/components/link';

export default function Container() {
  return (
    <ExpandableSection
      variant="container"
      headerText="Gateways"
      headerCounter="(2)"
      headerDescription="Entry points to the north-annex project"
      headerInfo={
        <Link variant="info" href="#/components/expandable-section">
          Info
        </Link>
      }
      headerActions={<Button iconName="add">Add gateway</Button>}
      defaultExpanded={true}
    >
      <KeyValuePairs
        columns={2}
        items={[
          { label: 'gw-north-01', value: '203.0.113.40, us-mountain-1a' },
          { label: 'gw-north-02', value: '203.0.113.41, us-mountain-1b' },
        ]}
      />
    </ExpandableSection>
  );
}
