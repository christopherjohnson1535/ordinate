// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import PullQuote from '@ordinate/components/pull-quote';
import SpaceBetween from '@ordinate/components/space-between';
import StyleScope from '@ordinate/components/style-scope';
import TextContent from '@ordinate/components/text-content';

export default function InAStory() {
  return (
    <StyleScope styleName="editorial">
      <SpaceBetween size="l">
        <TextContent>
          <p>
            The storm took the sea wall in a single night. In the weeks after, the town met in the school hall to decide
            whether to build it again, higher and further out.
          </p>
        </TextContent>
        <PullQuote variant="hanging" attribution="Mara Lindqvist, harbour master">
          We stopped fighting the water. The water was always going to win.
        </PullQuote>
        <TextContent>
          <p>They chose the marsh. Three years on, the samphire is back, and so are the people who come to pick it.</p>
        </TextContent>
      </SpaceBetween>
    </StyleScope>
  );
}
