// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import ColumnLayout from '@ordinate/components/column-layout';
import Media from '@ordinate/components/media';
import Plate from '@ordinate/components/plate';
import SpaceBetween from '@ordinate/components/space-between';
import StyleScope from '@ordinate/components/style-scope';

const projects = [
  { href: '/work/hut-3', label: 'No. 14', title: 'Hut No. 3', meta: 'Borders, 2026' },
  { href: '/work/boathouse', label: 'No. 15', title: 'Boathouse', meta: 'Loch Fyne, 2026' },
];

export default function Router() {
  const [opened, setOpened] = useState('No project opened yet.');

  return (
    <StyleScope styleName="studio">
      <SpaceBetween size="m">
        <ColumnLayout columns={2}>
          {projects.map(project => (
            <Plate
              key={project.href}
              headingLevel={2}
              href={project.href}
              onFollow={event => {
                // A router would show the project page here instead of loading a new page.
                event.preventDefault();
                setOpened(`Routed on the client to ${event.detail.href}`);
              }}
              media={<Media aspectRatio="3:2" placeholderText="Site photo to come" />}
              label={project.label}
              title={project.title}
              meta={project.meta}
            />
          ))}
        </ColumnLayout>
        <Box color="text-body-secondary" fontSize="body-s">
          {opened}
        </Box>
      </SpaceBetween>
    </StyleScope>
  );
}
