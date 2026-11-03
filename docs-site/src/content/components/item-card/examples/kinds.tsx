// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ColumnLayout from '@ordinate/components/column-layout';
import ItemCard from '@ordinate/components/item-card';

export default function Kinds() {
  return (
    <ColumnLayout columns={2}>
      <ItemCard header="build.yaml" description="Image, region and scaling limits" reference="C1" kind="configuration">
        Changed yesterday.
      </ItemCard>
      <ItemCard header="node-02" description="m7.xlarge in us-mountain-1b" reference="R2" kind="resource">
        Running for 312 hours.
      </ItemCard>
      <ItemCard header="deploy-approvers" description="Who can deploy to production" reference="P1" kind="policy">
        4 people, 1 group.
      </ItemCard>
      <ItemCard header="North Annex handbook" description="Notes for new members of the team" kind="neutral">
        12 pages.
      </ItemCard>
    </ColumnLayout>
  );
}
