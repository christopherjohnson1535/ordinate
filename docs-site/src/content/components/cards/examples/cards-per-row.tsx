// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Cards from '@ordinate/components/cards';
import Header from '@ordinate/components/header';

interface Policy {
  id: string;
  name: string;
  applies: string;
}

const policies: Policy[] = [
  { id: 'P1', name: 'deploy-approvers', applies: 'Production deployments' },
  { id: 'P2', name: 'read-only-auditors', applies: 'Every project' },
  { id: 'P3', name: 'on-call-restart', applies: 'Services in us-mountain-1' },
  { id: 'P4', name: 'billing-admins', applies: 'Account settings' },
];

export default function CardsPerRow() {
  return (
    <Cards
      items={policies}
      trackBy="id"
      kind="policy"
      variant="full-page"
      cardsPerRow={[{ cards: 1 }, { minWidth: 500, cards: 2 }, { minWidth: 900, cards: 4 }]}
      header={<Header counter={`(${policies.length})`}>Access policies</Header>}
      cardDefinition={{
        header: policy => policy.name,
        reference: policy => policy.id,
        sections: [{ id: 'applies', header: 'Applies to', content: policy => policy.applies }],
      }}
    />
  );
}
