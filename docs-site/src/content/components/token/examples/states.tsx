// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Icon from '@ordinate/components/icon';
import SpaceBetween from '@ordinate/components/space-between';
import Token from '@ordinate/components/token';

export default function States() {
  return (
    <SpaceBetween direction="horizontal" size="s">
      <Token label="US Mountain" description="Denver" icon={<Icon name="globe" />} onDismiss={() => undefined} />
      <Token
        label="AP South"
        description="Not available to this account"
        icon={<Icon name="globe" />}
        disabled={true}
        onDismiss={() => undefined}
      />
      <Token label="US Coastal" description="Set by your administrator" readOnly={true} onDismiss={() => undefined} />
    </SpaceBetween>
  );
}
