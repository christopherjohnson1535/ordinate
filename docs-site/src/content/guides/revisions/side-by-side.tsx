// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import Badge from '@ordinate/components/badge';
import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import Checkbox from '@ordinate/components/checkbox';
import ColumnLayout from '@ordinate/components/column-layout';
import Container from '@ordinate/components/container';
import FormField from '@ordinate/components/form-field';
import Input from '@ordinate/components/input';
import SpaceBetween from '@ordinate/components/space-between';
import { applyRevision, Revision } from '@ordinate/global-styles';

function Specimen({ revision }: { revision: Revision }) {
  const [name, setName] = useState('north-annex');
  const [notify, setNotify] = useState(true);

  return (
    <Container heading={`Revision ${revision}`} measure={revision === Revision.V2026_1 ? 'Pinned' : 'Trying'}>
      <SpaceBetween size="m">
        <FormField label="Project name" layout="stacked">
          <Input value={name} onChange={event => setName(event.detail.value)} />
        </FormField>
        <Checkbox checked={notify} onChange={event => setNotify(event.detail.checked)}>
          Email the owner after each deploy
        </Checkbox>
        <SpaceBetween direction="horizontal" size="xs" alignItems="center">
          <Button>Cancel</Button>
          <Button variant="primary">Save</Button>
          <Badge tone="note">Standard</Badge>
        </SpaceBetween>
      </SpaceBetween>
    </Container>
  );
}

export default function SideBySide() {
  const current = useRef<HTMLDivElement>(null);
  const next = useRef<HTMLDivElement>(null);

  // Each element pins its own subtree, whatever revision the page around it uses.
  useEffect(() => {
    if (current.current && next.current) {
      applyRevision(Revision.V2026_1, current.current);
      applyRevision(Revision.V2026_2, next.current);
    }
  }, []);

  return (
    <SpaceBetween size="m">
      <ColumnLayout columns={2}>
        <div ref={current}>
          <Specimen revision={Revision.V2026_1} />
        </div>
        <div ref={next}>
          <Specimen revision={Revision.V2026_2} />
        </div>
      </ColumnLayout>
      <Box color="text-body-secondary" fontSize="body-s">
        The markup and props are the same on both sides. Only the corner radii differ.
      </Box>
    </SpaceBetween>
  );
}
