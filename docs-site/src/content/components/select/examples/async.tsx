// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import FormField from '@ordinate/components/form-field';
import Select, { SelectProps } from '@ordinate/components/select';

const vaults: SelectProps.Option[] = [
  { value: 'vault-north-annex', label: 'vault-north-annex', description: 'Daily, kept 30 days' },
  { value: 'vault-atrium', label: 'vault-atrium', description: 'Hourly, kept 2 days' },
  { value: 'vault-archive', label: 'vault-archive', description: 'Weekly, kept 7 years' },
];

// Fails the first time, so the retry button can be tried.
function fetchVaults(attempt: number): Promise<SelectProps.Option[]> {
  return new Promise((resolve, reject) =>
    window.setTimeout(() => (attempt === 0 ? reject(new Error('timeout')) : resolve(vaults)), 900)
  );
}

export default function Async() {
  const [vault, setVault] = useState<SelectProps.Option | null>(null);
  const [options, setOptions] = useState<SelectProps.Option[]>([]);
  const [status, setStatus] = useState<SelectProps.StatusType>('pending');
  const attempts = useRef(0);

  const load = () => {
    setStatus('loading');
    fetchVaults(attempts.current++).then(
      loaded => {
        setOptions(loaded);
        setStatus('finished');
      },
      () => setStatus('error')
    );
  };

  return (
    <FormField label="Backup vault" description="Vaults in us-mountain-1.">
      <Select
        selectedOption={vault}
        onChange={event => setVault(event.detail.selectedOption)}
        options={options}
        placeholder="Choose a vault"
        statusType={status}
        loadingText="Loading vaults"
        errorText="The vaults could not be loaded."
        recoveryText="Retry"
        errorIconAriaLabel="Error"
        empty="No vaults in us-mountain-1."
        onLoadItems={() => {
          if (status !== 'finished' && status !== 'loading') {
            load();
          }
        }}
      />
    </FormField>
  );
}
