// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import TokenGroup, { TokenGroupProps } from '@ordinate/components/token-group';

const labels = ['team:platform', 'env:production', 'tier:web', 'cost-centre:4410', 'owner:dana-ruiz', 'backup:nightly'];

export default function Limit() {
  const [items, setItems] = useState<TokenGroupProps.Item[]>(labels.map(label => ({ label })));

  return (
    <TokenGroup
      ariaLabel="Labels on north-annex-web"
      items={items}
      limit={3}
      onDismiss={event => setItems(current => current.filter((_, index) => index !== event.detail.itemIndex))}
    />
  );
}
