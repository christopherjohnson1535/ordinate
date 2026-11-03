// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import ColumnLayout from '@ordinate/components/column-layout';
import Header from '@ordinate/components/header';
import SpaceBetween from '@ordinate/components/space-between';
import StyleScope, { StyleScopeProps } from '@ordinate/components/style-scope';

const styleNames: StyleScopeProps.StyleName[] = ['console', 'editorial', 'studio', 'shopfront'];

export default function Styles() {
  return (
    <ColumnLayout columns={2} minColumnWidth={240} borders="all">
      {styleNames.map(styleName => (
        <StyleScope key={styleName} styleName={styleName} tagOverride="section" ariaLabel={`${styleName} style`}>
          <SpaceBetween size="s">
            <Box variant="small">{styleName}</Box>
            <Header variant="h2" description="Fixit Bikes, Leith. Open Tuesday to Sunday.">
              Book a repair
            </Header>
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="primary">Book a slot</Button>
              <Button>See prices</Button>
            </SpaceBetween>
          </SpaceBetween>
        </StyleScope>
      ))}
    </ColumnLayout>
  );
}
