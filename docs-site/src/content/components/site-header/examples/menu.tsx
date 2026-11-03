// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';
import Grid from '@ordinate/components/grid';
import SiteHeader from '@ordinate/components/site-header';
import StyleScope from '@ordinate/components/style-scope';

export default function Menu() {
  return (
    <StyleScope styleName="studio">
      {/* The header measures its own width, so a narrow column shows the menu at any window size. */}
      <Grid gridDefinition={[{ colspan: { default: 12, xs: 8 } }]}>
        <div>
          <SiteHeader
            brand={{ name: 'Harbour & Pine', href: '#/components/site-header' }}
            links={[
              { text: 'Work', href: '#/components/site-header', current: true },
              { text: 'Studio', href: '#/components/site-header' },
              { text: 'Journal', href: '#/components/site-header' },
              { text: 'Contact', href: '#/components/site-header' },
            ]}
            menuButtonText="Index"
            navigationAriaLabel="Harbour & Pine"
          />
          <Box padding="l" color="text-body-secondary" fontSize="body-s">
            Open the Index to see the links. Escape closes it.
          </Box>
        </div>
      </Grid>
    </StyleScope>
  );
}
