// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import FormField from '~components/form-field';
import Input from '~components/input';

import styles from './styles.module.scss';

export default function FormFieldSimple() {
  const [name, setName] = useState('north-annex');
  const [capacity, setCapacity] = useState('0');

  const capacityError = Number(capacity) < 1 ? 'Enter at least 1 node.' : undefined;

  return (
    <form className={styles.form} onSubmit={event => event.preventDefault()}>
      <h1>Create project</h1>
      <FormField
        label="Project name"
        description="Shown in the console and in billing."
        constraintText="Lowercase letters, numbers and hyphens."
      >
        <Input value={name} onChange={event => setName(event.detail.value)} />
      </FormField>
      <FormField label="Capacity" description="Number of nodes to start with." errorText={capacityError}>
        <Input type="number" value={capacity} onChange={event => setCapacity(event.detail.value)} />
      </FormField>
      <FormField label="Region" description="Set by your organization.">
        <Input value="us-mountain-1" readOnly={true} />
      </FormField>
      <FormField label="Billing account">
        <Input value="" placeholder="Not available on the free plan" disabled={true} />
      </FormField>
      <div className={styles.actions}>
        <Button formAction="none">Cancel</Button>
        <Button variant="primary">Create project</Button>
      </div>
    </form>
  );
}
