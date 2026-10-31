// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import FormField from '~components/form-field';
import Input from '~components/input';

import styles from './styles.module.scss';

const descriptionLimit = 64;

export default function FormFieldSimple() {
  const [name, setName] = useState('north-annex');
  const [capacity, setCapacity] = useState('80');
  const [summary, setSummary] = useState('Staging cluster for the annex.');
  const [both, setBoth] = useState('');

  const nodes = Number(capacity);
  const capacityError = nodes < 1 ? 'Enter at least 1 node.' : undefined;
  const capacityWarning = nodes > 50 ? 'More than 50 nodes takes several minutes to start.' : undefined;
  const summaryLeft = descriptionLimit - summary.length;

  return (
    <form className={styles.form} onSubmit={event => event.preventDefault()}>
      <h1>Create project</h1>
      <FormField
        label="Project name"
        info={<a href="#form-field/simple">Info</a>}
        description="Shown in the console and in billing."
        constraintText="Lowercase letters, numbers and hyphens."
        secondaryControl={
          <Button formAction="none" fullWidth={true} onClick={() => setName(`project-${Date.now() % 10000}`)}>
            Generate
          </Button>
        }
      >
        <Input value={name} onChange={event => setName(event.detail.value)} />
      </FormField>
      <FormField
        label="Capacity"
        description="Number of nodes to start with. Try 0 or more than 50."
        errorText={capacityError}
        warningText={capacityWarning}
      >
        <Input type="number" value={capacity} onChange={event => setCapacity(event.detail.value)} />
      </FormField>
      <FormField
        label="Summary"
        constraintText={`Up to ${descriptionLimit} characters.`}
        characterCountText={summaryLeft >= 0 ? `${summaryLeft} characters left` : `${-summaryLeft} characters over`}
        errorText={summaryLeft < 0 ? 'Shorten the summary.' : undefined}
        stretch={true}
      >
        <Input value={summary} onChange={event => setSummary(event.detail.value)} />
      </FormField>
      <FormField
        label="Error and warning together"
        description="Only the error shows."
        errorText={both ? undefined : 'Enter a value.'}
        warningText="This warning is hidden while there is an error."
      >
        <Input value={both} onChange={event => setBoth(event.detail.value)} />
      </FormField>
      <FormField
        label="Endpoint"
        stretch={true}
        secondaryControl={
          <Button formAction="none" iconName="copy">
            Copy endpoint
          </Button>
        }
      >
        <Input value="https://api.north-annex.internal" readOnly={true} />
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
