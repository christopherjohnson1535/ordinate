// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Link from '@ordinate/components/link';
import Table from '@ordinate/components/table';

export interface Part {
  /** The component's name, such as `AppLayout`. */
  name: string;
  /** The component's folder, which is its page on this site. */
  folder: string;
  /** What it does on this page, and why it was chosen over the alternatives. */
  role: React.ReactNode;
}

/** The components a pattern is built from, as a schedule linked to their pages. */
export function Composition({ parts }: { parts: ReadonlyArray<Part> }) {
  return (
    <Table
      variant="embedded"
      wrapLines={true}
      caption="Schedule of parts"
      trackBy="name"
      items={parts}
      ariaLabels={{ tableLabel: 'Components on this page' }}
      columnDefinitions={[
        {
          id: 'name',
          header: 'Component',
          cell: part => <Link href={`#/components/${part.folder}`}>{part.name}</Link>,
          width: '22%',
          isRowHeader: true,
        },
        { id: 'role', header: 'Role on the page', cell: part => part.role },
      ]}
    />
  );
}
