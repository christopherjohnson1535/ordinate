// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '@ordinate/components/box';

interface PageModule {
  default: React.ComponentType;
}

/**
 * Sets a whole-page example on a sheet with the 24 px margin of the dev pages it was written for.
 * Pages such as the website pull themselves out to the sheet's edges with negative margins, so
 * without it they would run under the example toolbar.
 */
export function onSheet(load: () => Promise<PageModule>): () => Promise<PageModule> {
  return () =>
    load().then(({ default: Page }) => ({
      default: function PageOnSheet() {
        return (
          <Box padding="l">
            <Page />
          </Box>
        );
      },
    }));
}
