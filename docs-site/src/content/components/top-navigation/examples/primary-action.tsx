// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import TopNavigation from '@ordinate/components/top-navigation';

const logo =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">' +
      '<rect width="28" height="28" fill="#131416"/><path d="M14 5v18M5 14h18" stroke="#fff" stroke-width="2"/></svg>'
  );

const stay = (event: CustomEvent) => event.preventDefault();

export default function PrimaryAction() {
  return (
    <TopNavigation
      identity={{
        href: '#/components/top-navigation',
        title: 'Harbour & Pine',
        logo: { src: logo, alt: 'Harbour & Pine' },
        onFollow: stay,
      }}
      utilities={[
        { type: 'button', text: 'Projects', href: '#/components/top-navigation', onClick: stay },
        { type: 'button', text: 'Studio', href: '#/components/top-navigation', onClick: stay },
        { type: 'button', text: 'Sign in', href: '#/components/top-navigation', onClick: stay },
        {
          type: 'button',
          text: 'Book a visit',
          variant: 'primary-button',
          href: '#/components/top-navigation',
          disableUtilityCollapse: true,
          onClick: stay,
        },
      ]}
    />
  );
}
