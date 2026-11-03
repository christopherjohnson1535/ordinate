// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AppLayoutToolbar from '@ordinate/components/app-layout-toolbar';
import BreadcrumbGroup from '@ordinate/components/breadcrumb-group';

export default function BreadcrumbsOnly() {
  return (
    <AppLayoutToolbar
      navigationHide={true}
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'Fixit Bikes', href: 'https://example.com/fixit-bikes' },
            { text: 'Repairs', href: 'https://example.com/fixit-bikes/repairs' },
            { text: 'Ticket 2041', href: 'https://example.com/fixit-bikes/repairs/2041' },
          ]}
          onFollow={event => event.preventDefault()}
        />
      }
    />
  );
}
