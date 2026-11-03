// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import Button from '@ordinate/components/button';
import Checkbox from '@ordinate/components/checkbox';
import Container from '@ordinate/components/container';
import FormField from '@ordinate/components/form-field';
import Input from '@ordinate/components/input';
import Link from '@ordinate/components/link';
import SpaceBetween from '@ordinate/components/space-between';
import { applyTheme, Theme } from '@ordinate/components/theming';
import Toggle from '@ordinate/components/toggle';

const harbour: Theme = {
  tokens: {
    colorBackgroundButtonPrimary: { light: '#0b5cad', dark: '#7cc4ff' },
    colorBackgroundButtonPrimaryHover: { light: '#084a8c', dark: '#a8d8ff' },
    colorTextLink: { light: '#0b5cad', dark: '#7cc4ff' },
    colorBackgroundControlChecked: { light: '#0b5cad', dark: '#7cc4ff' },
    borderRadiusButton: '999px',
    borderRadiusInput: '8px',
  },
};

export default function ScopedTheme() {
  const region = useRef<HTMLDivElement>(null);
  const [themed, setThemed] = useState(true);
  const [notify, setNotify] = useState(true);
  const [address, setAddress] = useState('dana.ruiz@example.com');

  // applyTheme returns reset, which the effect hands back as its cleanup.
  useEffect(() => {
    if (themed && region.current) {
      return applyTheme({ theme: harbour, target: region.current }).reset;
    }
  }, [themed]);

  return (
    <SpaceBetween size="l">
      <Toggle checked={themed} onChange={event => setThemed(event.detail.checked)}>
        Harbour brand theme
      </Toggle>
      <div ref={region}>
        <Container heading="Notifications">
          <SpaceBetween size="m">
            <FormField label="Address">
              <Input type="email" value={address} onChange={event => setAddress(event.detail.value)} />
            </FormField>
            <Checkbox checked={notify} onChange={event => setNotify(event.detail.checked)}>
              Email me when a deploy finishes
            </Checkbox>
            <Link href="https://example.com">Manage addresses</Link>
            <SpaceBetween direction="horizontal" size="xs">
              <Button>Cancel</Button>
              <Button variant="primary">Save</Button>
            </SpaceBetween>
          </SpaceBetween>
        </Container>
      </div>
    </SpaceBetween>
  );
}
