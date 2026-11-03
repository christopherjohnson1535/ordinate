// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '@ordinate/components/button';
import Icon from '@ordinate/components/icon';
import Token from '@ordinate/components/token';

export default function Normal() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return <Button onClick={() => setVisible(true)}>Choose eu-north-1 again</Button>;
  }

  return (
    <Token
      label="EU North"
      labelTag="eu-north-1"
      description="Stockholm"
      tags={['3 zones', 'Low carbon']}
      icon={<Icon name="globe" />}
      dismissLabel="Remove EU North"
      onDismiss={() => setVisible(false)}
    />
  );
}
