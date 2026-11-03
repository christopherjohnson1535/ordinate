// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Container from '@ordinate/components/container';
import Header from '@ordinate/components/header';
import SpaceBetween from '@ordinate/components/space-between';

export default function Stack() {
  return (
    <SpaceBetween size="l">
      <Header variant="h1" description="Production environment for the annex.">
        north-annex
      </Header>
      <Container heading="Overview">20 nodes in us-mountain-1, owned by Dana Ruiz.</Container>
      <Container heading="Endpoints">north-annex.ordinate.dev, on HTTPS and gRPC.</Container>
    </SpaceBetween>
  );
}
