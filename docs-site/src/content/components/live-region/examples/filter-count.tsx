// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import Box from '@ordinate/components/box';
import FormField from '@ordinate/components/form-field';
import Input from '@ordinate/components/input';
import LiveRegion from '@ordinate/components/live-region';
import SpaceBetween from '@ordinate/components/space-between';

const nodes = Array.from({ length: 24 }, (_, index) => `north-annex-${String(index + 1).padStart(2, '0')}`);

// For this demo only: lists what the live region hands to screen readers, so you can see it.
function useAnnouncements(region: React.RefObject<HTMLDivElement | null>) {
  const [heard, setHeard] = useState<string[]>([]);
  useEffect(() => {
    const announcer = region.current?.querySelector('[aria-live]');
    if (!announcer) {
      return;
    }
    const observer = new MutationObserver(() => {
      const text = announcer.textContent ?? '';
      setHeard(current => [text, ...current].slice(0, 4));
    });
    observer.observe(announcer, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, [region]);
  return heard;
}

export default function FilterCount() {
  const [filter, setFilter] = useState('');
  const region = useRef<HTMLDivElement>(null);
  const heard = useAnnouncements(region);
  const matches = nodes.filter(node => node.includes(filter.trim()));

  return (
    <SpaceBetween size="m">
      <FormField label="Filter nodes" description="Type 1, then 12, to narrow the list.">
        <Input type="search" value={filter} onChange={event => setFilter(event.detail.value)} />
      </FormField>
      <div ref={region}>
        <LiveRegion>
          <Box color="text-body-secondary">
            {matches.length} {matches.length === 1 ? 'node matches' : 'nodes match'}
          </Box>
        </LiveRegion>
      </div>
      <Box fontSize="body-s" color="text-body-secondary">
        Screen reader hears, newest first: {heard.length ? heard.join(' · ') : 'nothing yet'}
      </Box>
    </SpaceBetween>
  );
}
