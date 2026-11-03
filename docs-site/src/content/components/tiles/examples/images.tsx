// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '@ordinate/components/form-field';
import Tiles from '@ordinate/components/tiles';

// A small elevation of a rack, with one slot drawn per unit.
function Rack({ units }: { units: number }) {
  return (
    <svg width="96" height="64" viewBox="0 0 96 64" fill="none" stroke="currentColor" aria-hidden="true">
      <rect x="28" y="4" width="40" height="56" strokeWidth="1.5" />
      {Array.from({ length: units }, (_, index) => (
        <rect key={index} x="32" y={52 - index * 10} width="32" height="6" strokeWidth="1" />
      ))}
      <path d="M20 60h56" strokeWidth="0.75" />
    </svg>
  );
}

export default function Images() {
  const [size, setSize] = useState<string | null>('medium');

  return (
    <FormField
      stretch={true}
      label="Node size"
      description="Applies to every node of atrium-api. You can resize later."
    >
      <Tiles
        value={size}
        onChange={event => setSize(event.detail.value)}
        items={[
          { value: 'small', label: 'Small', description: '2 vCPU, 4 GiB', image: <Rack units={1} /> },
          { value: 'medium', label: 'Medium', description: '8 vCPU, 32 GiB', image: <Rack units={3} /> },
          { value: 'large', label: 'Large', description: '32 vCPU, 128 GiB', image: <Rack units={5} /> },
        ]}
      />
    </FormField>
  );
}
