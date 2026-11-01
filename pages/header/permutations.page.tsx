// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Header, { HeaderProps } from '~components/header';
import SpaceBetween from '~components/space-between';

const variants: HeaderProps.Variant[] = ['h1', 'h2', 'h3'];

const actions = (
  <SpaceBetween size="xs" direction="horizontal">
    <Button formAction="none">Export</Button>
    <Button formAction="none" variant="primary">
      Add node
    </Button>
  </SpaceBetween>
);

const info = <a href="#info">Info</a>;

export default function HeaderPermutations() {
  return (
    <SpaceBetween size="xxl">
      {variants.map(variant => (
        <section key={variant}>
          <SpaceBetween size="l">
            <Box variant="small">variant {variant}</Box>
            <Header variant={variant} headingTagOverride="div">
              Nodes
            </Header>
            <Header variant={variant} headingTagOverride="div" counter="(12)" info={info}>
              Nodes
            </Header>
            <Header
              variant={variant}
              headingTagOverride="div"
              counter="(12)"
              info={info}
              description="Machines that run this project. Stopped nodes are not billed."
              actions={actions}
            >
              Nodes
            </Header>
            <Header
              variant={variant}
              headingTagOverride="div"
              code="Sheet A-02"
              description="Every node of the north annex, by zone."
              actions={actions}
            >
              Service schedule
            </Header>
            <Header
              variant={variant}
              headingTagOverride="div"
              description="A long title wraps onto the next line before the actions do."
              actions={actions}
            >
              Nodes in north annex, us-mountain-1, reserved capacity pool for scheduled batch work
            </Header>
          </SpaceBetween>
        </section>
      ))}
    </SpaceBetween>
  );
}
