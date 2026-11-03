// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import FormField from '@ordinate/components/form-field';
import Input from '@ordinate/components/input';
import SiteFooter from '@ordinate/components/site-footer';
import SpaceBetween from '@ordinate/components/space-between';
import StyleScope from '@ordinate/components/style-scope';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <StyleScope styleName="editorial">
      <SiteFooter
        tone="inverted"
        brand={{ name: 'The Plot' }}
        columns={[
          {
            title: 'Read',
            links: [
              { text: 'Essays', href: 'https://example.com/essays' },
              { text: 'Field notes', href: 'https://example.com/notes' },
              { text: 'Recipes', href: 'https://example.com/recipes' },
            ],
          },
          {
            title: 'The journal',
            links: [
              { text: 'Back issues', href: 'https://example.com/archive' },
              { text: 'Write for us', href: 'https://example.com/write' },
            ],
          },
        ]}
        legal={<span>© 2026 The Plot · Printed in Leith</span>}
      >
        <form
          onSubmit={event => {
            event.preventDefault();
            setSent(true);
          }}
        >
          <SpaceBetween size="xs">
            <SpaceBetween direction="horizontal" size="xs" alignItems="end">
              <FormField label="The Thursday letter">
                <Input type="email" value={email} onChange={event => setEmail(event.detail.value)} />
              </FormField>
              <Button>Subscribe</Button>
            </SpaceBetween>
            {sent && <Box fontSize="body-s">Thank you. The next letter is on its way on Thursday.</Box>}
          </SpaceBetween>
        </form>
      </SiteFooter>
    </StyleScope>
  );
}
