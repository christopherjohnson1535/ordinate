// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Button from '~components/button';
import FormField from '~components/form-field';
import Header from '~components/header';
import Input from '~components/input';
import SpaceBetween from '~components/space-between';
import StyleScope, { StyleScopeProps } from '~components/style-scope';

import styles from './styles.module.scss';

const styleNames: StyleScopeProps.StyleName[] = ['console', 'editorial', 'studio', 'shopfront'];

// The same components in every style, each in its own scope, so they can be compared on one page.
export default function SideBySide() {
  return (
    <div className={styles.grid}>
      {styleNames.map(styleName => (
        <StyleScope key={styleName} styleName={styleName} tagOverride="section" ariaLabel={`${styleName} style`}>
          <div className={styles.cell}>
            <SpaceBetween size="m">
              <Box variant="small" color="text-body-secondary">
                {styleName}
              </Box>
              <Header variant="h2" description="The same components, in another voice.">
                Book a visit
              </Header>
              <FormField label="Email">
                <Input value="" placeholder="you@example.com" onChange={() => {}} />
              </FormField>
              <SpaceBetween direction="horizontal" size="xs">
                <Button variant="primary">Continue</Button>
                <Button>Not now</Button>
              </SpaceBetween>
            </SpaceBetween>
          </div>
        </StyleScope>
      ))}
    </div>
  );
}
