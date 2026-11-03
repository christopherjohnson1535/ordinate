// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import ContentLayout from '@ordinate/components/content-layout';
import Header from '@ordinate/components/header';

export default function MaxWidth() {
  return (
    <ContentLayout
      defaultPadding={true}
      headerVariant="divider"
      maxContentWidth={520}
      header={
        <Header variant="h1" description="Published 28 October 2026">
          Truing a wheel
        </Header>
      }
    >
      <Box variant="p">
        Spin the wheel and watch the gap at the brake pad. Where the rim swings toward the pad, loosen the spokes on
        that side and tighten the ones opposite, a quarter turn at a time. Check again after every pair of turns, and
        stop when the gap stays the same all the way round.
      </Box>
    </ContentLayout>
  );
}
