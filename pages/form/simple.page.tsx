// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import Form from '~components/form';
import FormField from '~components/form-field';
import Input from '~components/input';
import Select, { SelectProps } from '~components/select';

import styles from './styles.module.scss';

const regions: SelectProps.Options = [
  { value: 'us-east', label: 'US East' },
  { value: 'us-west', label: 'US West' },
  { value: 'eu-north', label: 'EU North' },
];

export default function FormSimple() {
  const [name, setName] = useState('north-annex');
  const [region, setRegion] = useState<SelectProps.Option | null>(null);
  const [error, setError] = useState<string>();

  return (
    <form
      className={styles.page}
      onSubmit={event => {
        event.preventDefault();
        setError(region ? undefined : 'The project was not created. Choose a region and try again.');
      }}
    >
      <Form
        kind="configuration"
        reference="C4"
        header={<h1 className={styles.heading}>Create project</h1>}
        errorText={error}
        errorIconAriaLabel="Error"
        secondaryActions={<Button formAction="none">Save draft</Button>}
        actions={
          <>
            <Button variant="link" formAction="none" onClick={() => setError(undefined)}>
              Cancel
            </Button>
            <Button variant="primary">Create project</Button>
          </>
        }
      >
        <div className={styles.fields}>
          <FormField label="Project name" description="Shown in lists." constraintText="Lowercase letters and hyphens.">
            <Input value={name} onChange={event => setName(event.detail.value)} />
          </FormField>
          <FormField label="Region">
            <Select
              options={regions}
              selectedOption={region}
              placeholder="Choose a region"
              onChange={event => setRegion(event.detail.selectedOption)}
            />
          </FormField>
        </div>
      </Form>
    </form>
  );
}
