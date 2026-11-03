// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ActionCard from '@ordinate/components/action-card';
import ColumnLayout from '@ordinate/components/column-layout';

export default function Kinds() {
  return (
    <ColumnLayout columns={2}>
      <ActionCard
        header="Edit the build settings"
        description="Change the image, the region and the scaling limits."
        iconName="edit"
        kind="configuration"
        onClick={() => undefined}
      />
      <ActionCard
        header="Add a node"
        description="Start another node in the north-annex cluster."
        iconName="add"
        kind="resource"
        onClick={() => undefined}
      />
      <ActionCard
        header="Write an access policy"
        description="Decide who can deploy to production."
        iconName="security"
        kind="policy"
        onClick={() => undefined}
      />
      <ActionCard
        header="Read the getting started guide"
        description="Ten minutes from an empty project to a running service."
        iconName="file"
        kind="neutral"
        onClick={() => undefined}
      />
    </ColumnLayout>
  );
}
