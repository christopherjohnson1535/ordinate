// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Form from '@ordinate/components/form';
import FormField from '@ordinate/components/form-field';
import Select, { SelectProps } from '@ordinate/components/select';

const roles: SelectProps.Options = [
  { value: 'viewer', label: 'Viewer', description: 'Reads drawings and comments.' },
  { value: 'editor', label: 'Editor', description: 'Changes drawings and issues revisions.' },
  { value: 'owner', label: 'Owner', description: 'Manages people and billing.' },
];

export default function States() {
  const [role, setRole] = useState<SelectProps.Option | null>(null);

  return (
    <Form>
      <FormField label="Role for Dana Ruiz" errorText={role ? undefined : 'Choose a role before you send the invite.'}>
        <Select
          selectedOption={role}
          onChange={event => setRole(event.detail.selectedOption)}
          options={roles}
          placeholder="Choose a role"
        />
      </FormField>
      <FormField label="Project" description="Invites go to the project you are in.">
        <Select selectedOption={{ value: 'north-annex', label: 'north-annex' }} options={[]} readOnly={true} />
      </FormField>
      <FormField label="Team" description="Create a team first.">
        <Select selectedOption={null} options={[]} placeholder="Choose a team" disabled={true} />
      </FormField>
    </Form>
  );
}
