// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import Icon, { IconProps } from '~components/icon';
import IconProvider from '~components/icon-provider';

import { Cell, Group, Row } from './specimen';

const sampleIcons: IconProps.Name[] = ['calendar', 'file', 'folder', 'map', 'adjust', 'complete', 'caution'];

// A spoked wheel in the same open 1.5 px stroke as the built-in icons, standing in for "adjust".
const wheel = (
  <svg viewBox="0 0 16 16" focusable="false" aria-hidden="true">
    <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M8 1.75v12.5M1.75 8h12.5M3.6 3.6l8.8 8.8M12.4 3.6l-8.8 8.8"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.75"
    />
  </svg>
);

export default function IconsGroup({ number }: { number: number }) {
  return (
    <Group number={number} title="Icons">
      <Cell name="Icon">
        <Row>
          {sampleIcons.map(name => (
            <Icon key={name} name={name} ariaLabel={name} />
          ))}
          <Icon name="adjust" size="big" ariaLabel="settings, big" />
        </Row>
      </Cell>
      <Cell name="IconProvider" note="Swaps the settings icon for a wheel inside the workshop's tools.">
        <IconProvider icons={{ adjust: wheel }}>
          <Row>
            <Icon name="adjust" ariaLabel="Workshop settings" />
            <Button iconName="adjust">Workshop settings</Button>
          </Row>
        </IconProvider>
      </Cell>
    </Group>
  );
}
