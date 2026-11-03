// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '@ordinate/components/form-field';
import Multiselect, { MultiselectProps } from '@ordinate/components/multiselect';

const allNodes: MultiselectProps.Option[] = Array.from({ length: 36 }, (_, index) => ({
  value: `node-${index + 1}`,
  label: `node-${String(index + 1).padStart(2, '0')}`,
  description: index % 2 === 0 ? 'us-mountain-1a' : 'us-mountain-1b',
}));

const pageSize = 12;

export default function Async() {
  const [options, setOptions] = useState<MultiselectProps.Option[]>([]);
  const [status, setStatus] = useState<MultiselectProps.StatusType>('pending');
  const [selected, setSelected] = useState<ReadonlyArray<MultiselectProps.Option>>([]);

  // Stands in for a paged request to the nodes API.
  const loadPage = (from: number) => {
    setStatus('loading');
    window.setTimeout(() => {
      const next = allNodes.slice(0, from + pageSize);
      setOptions(next);
      setStatus(next.length >= allNodes.length ? 'finished' : 'pending');
    }, 800);
  };

  return (
    <FormField label="Nodes to drain" description="Scroll to the end of the list to load more.">
      <Multiselect
        options={options}
        selectedOptions={selected}
        placeholder="Choose nodes"
        statusType={status}
        loadingText="Loading nodes"
        finishedText={`All ${allNodes.length} nodes loaded`}
        empty="No nodes"
        tokenLimit={3}
        onLoadItems={event => {
          if (event.detail.firstPage && options.length === 0) {
            loadPage(0);
          } else if (!event.detail.firstPage) {
            loadPage(options.length);
          }
        }}
        onChange={event => setSelected(event.detail.selectedOptions)}
      />
    </FormField>
  );
}
