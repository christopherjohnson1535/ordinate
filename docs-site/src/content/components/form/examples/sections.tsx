// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '@ordinate/components/button';
import Checkbox from '@ordinate/components/checkbox';
import Container from '@ordinate/components/container';
import Form from '@ordinate/components/form';
import FormField from '@ordinate/components/form-field';
import Header from '@ordinate/components/header';
import Input from '@ordinate/components/input';
import SpaceBetween from '@ordinate/components/space-between';

export default function Sections() {
  const [image, setImage] = useState('survey-api:v7');
  const [nodes, setNodes] = useState('4');
  const [logs, setLogs] = useState(true);

  return (
    <form onSubmit={event => event.preventDefault()}>
      <Form
        kind="resource"
        reference="R2"
        header={<Header variant="h2">Edit survey-api</Header>}
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button formAction="none" variant="link">
              Cancel
            </Button>
            <Button variant="primary">Save changes</Button>
          </SpaceBetween>
        }
      >
        <SpaceBetween size="l">
          <Container kind="resource" reference="R2.1" heading="Service" headingLevel={3}>
            <SpaceBetween size="l">
              <FormField label="Image" constraintText="name:tag">
                <Input value={image} onChange={event => setImage(event.detail.value)} />
              </FormField>
              <FormField label="Nodes" description="Running at all times.">
                <Input type="number" value={nodes} onChange={event => setNodes(event.detail.value)} />
              </FormField>
            </SpaceBetween>
          </Container>
          <Container kind="resource" reference="R2.2" heading="Logging" headingLevel={3}>
            <FormField label="Request logs">
              <Checkbox checked={logs} onChange={event => setLogs(event.detail.checked)}>
                Keep request logs for 30 days
              </Checkbox>
            </FormField>
          </Container>
        </SpaceBetween>
      </Form>
    </form>
  );
}
