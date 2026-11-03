// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import TokenGroup, { TokenGroupProps } from '@ordinate/components/token-group';

export default function Vertical() {
  const [items, setItems] = useState<TokenGroupProps.Item[]>([
    {
      label: 'Dana Ruiz',
      labelTag: 'Owner',
      description: 'dana.ruiz@example.com',
      iconName: 'person',
      tags: ['Can deploy', 'Can approve'],
    },
    { label: 'Sam Okafor', labelTag: 'Deployer', description: 'sam.okafor@example.com', iconName: 'person' },
    {
      label: 'Billing team',
      labelTag: 'Group',
      description: 'Managed by your administrator',
      iconName: 'group',
      disabled: true,
    },
  ]);

  return (
    <TokenGroup
      ariaLabel="People who get the release notes"
      alignment="vertical"
      items={items}
      onDismiss={event => setItems(current => current.filter((_, index) => index !== event.detail.itemIndex))}
    />
  );
}
