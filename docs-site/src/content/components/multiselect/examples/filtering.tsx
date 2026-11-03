// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '@ordinate/components/form-field';
import Multiselect, { MultiselectProps } from '@ordinate/components/multiselect';

const people: MultiselectProps.Options = [
  {
    label: 'Drafting',
    options: [
      { value: 'dana', label: 'Dana Ruiz', description: 'Lead', tags: ['Owner'] },
      { value: 'mei', label: 'Mei Tanaka', description: 'Structures' },
      { value: 'jonas', label: 'Jonas Berg', description: 'Services' },
    ],
  },
  {
    label: 'Site',
    options: [
      { value: 'amir', label: 'Amir Haddad', description: 'Survey' },
      { value: 'priya', label: 'Priya Nair', description: 'Survey' },
      { value: 'tomas', label: 'Tomás Ortega', description: 'On leave', disabled: true },
    ],
  },
];

export default function Filtering() {
  const [selected, setSelected] = useState<ReadonlyArray<MultiselectProps.Option>>([
    { value: 'dana', label: 'Dana Ruiz' },
    { value: 'amir', label: 'Amir Haddad' },
    { value: 'priya', label: 'Priya Nair' },
  ]);

  return (
    <FormField label="Reviewers" description="Each reviewer signs off on the north-annex drawings.">
      <Multiselect
        options={people}
        selectedOptions={selected}
        placeholder="Choose reviewers"
        filteringType="auto"
        filteringPlaceholder="Find people"
        filteringAriaLabel="Find people"
        noMatch="No one matches"
        enableSelectAll={true}
        tokenLimit={2}
        i18nStrings={{ selectAllText: 'Select everyone shown' }}
        onChange={event => setSelected(event.detail.selectedOptions)}
      />
    </FormField>
  );
}
