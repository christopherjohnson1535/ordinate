// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import SideNavigation, { SideNavigationProps } from '@ordinate/components/side-navigation';

const items: SideNavigationProps.Item[] = [
  { type: 'link', text: 'Projects', href: '#/projects' },
  {
    type: 'link-group',
    text: 'Access',
    href: '#/access',
    items: [
      { type: 'link', text: 'People', href: '#/access/people' },
      { type: 'link', text: 'Roles', href: '#/access/roles' },
      { type: 'link', text: 'Policies', href: '#/access/policies' },
    ],
  },
  {
    type: 'expandable-link-group',
    text: 'Billing',
    href: '#/billing',
    items: [
      { type: 'link', text: 'Invoices', href: '#/billing/invoices' },
      { type: 'link', text: 'Payment methods', href: '#/billing/payment-methods' },
    ],
  },
  {
    type: 'expandable-link-group',
    text: 'Audit',
    href: '#/audit',
    items: [
      { type: 'link', text: 'Sign-ins', href: '#/audit/sign-ins' },
      { type: 'link', text: 'Changes', href: '#/audit/changes' },
    ],
  },
];

export default function LinkGroups() {
  const [activeHref, setActiveHref] = useState('#/access/roles');

  return (
    <SideNavigation
      header={{ text: 'Account', href: '#/' }}
      items={items}
      activeHref={activeHref}
      onFollow={event => {
        event.preventDefault();
        setActiveHref(event.detail.href);
      }}
    />
  );
}
