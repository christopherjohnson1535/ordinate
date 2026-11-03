// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ColumnLayout from '@ordinate/components/column-layout';
import Skeleton from '@ordinate/components/skeleton';
import SpaceBetween from '@ordinate/components/space-between';

export default function Shapes() {
  return (
    <SpaceBetween size="l">
      <SpaceBetween size="xs">
        <Skeleton variant="heading" width="medium" loadingText="Loading the article" />
        <Skeleton lines={4} loadingText="" />
      </SpaceBetween>
      <SpaceBetween size="xxs">
        <Skeleton width="full" loadingText="" />
        <Skeleton width="large" loadingText="" />
        <Skeleton width="medium" loadingText="" />
        <Skeleton width="small" loadingText="" />
      </SpaceBetween>
      <ColumnLayout columns={3}>
        <Skeleton variant="block" height="small" loadingText="" />
        <Skeleton variant="block" height="medium" loadingText="" />
        <Skeleton variant="block" height="large" loadingText="" />
      </ColumnLayout>
    </SpaceBetween>
  );
}
