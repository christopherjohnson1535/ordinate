// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '@ordinate/components/form-field';
import Textarea from '@ordinate/components/textarea';

export default function Basic() {
  const [notes, setNotes] = useState(
    'Revision C moves the east stair 600 mm north. Structural to confirm the new opening in the slab.'
  );

  return (
    <FormField label="Revision notes" description="Shown on the drawing register for north-annex.">
      <Textarea
        value={notes}
        onChange={event => setNotes(event.detail.value)}
        rows={4}
        placeholder="What changed in this revision and why"
      />
    </FormField>
  );
}
