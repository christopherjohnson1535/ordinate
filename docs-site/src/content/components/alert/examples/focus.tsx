// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import Alert, { AlertProps } from '@ordinate/components/alert';
import Button from '@ordinate/components/button';
import FormField from '@ordinate/components/form-field';
import Input from '@ordinate/components/input';
import SpaceBetween from '@ordinate/components/space-between';

export default function Focus() {
  const [name, setName] = useState('north-annex');
  const [failed, setFailed] = useState(false);
  const alertRef = useRef<AlertProps.Ref>(null);

  // Move focus to the alert once it is on the page, so screen readers read it straight away.
  useEffect(() => {
    if (failed) {
      alertRef.current?.focus();
    }
  }, [failed]);

  return (
    <SpaceBetween size="m">
      {failed && (
        <Alert ref={alertRef} type="fault" header="The project was not renamed">
          A project called {name} already exists in us-mountain-1. Choose another name.
        </Alert>
      )}
      <FormField label="Project name">
        <Input value={name} onChange={event => setName(event.detail.value)} />
      </FormField>
      <SpaceBetween direction="horizontal" size="xs">
        <Button variant="primary" onClick={() => setFailed(true)}>
          Rename project
        </Button>
        <Button variant="link" onClick={() => setFailed(false)}>
          Reset
        </Button>
      </SpaceBetween>
    </SpaceBetween>
  );
}
