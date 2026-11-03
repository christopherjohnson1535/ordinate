// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import Box from '@ordinate/components/box';
import Button from '@ordinate/components/button';
import LiveRegion from '@ordinate/components/live-region';
import SpaceBetween from '@ordinate/components/space-between';
import StatusIndicator from '@ordinate/components/status-indicator';

type SaveState = 'idle' | 'saving' | 'saved';

// For this demo only: shows what the live regions inside `area` hand to screen readers.
function useAnnouncements(area: React.RefObject<HTMLDivElement | null>) {
  const [heard, setHeard] = useState<string[]>([]);
  useEffect(() => {
    const announcers = area.current?.querySelectorAll('[aria-live]') ?? [];
    const observer = new MutationObserver(records => {
      for (const record of records) {
        const target = record.target instanceof Element ? record.target : record.target.parentElement;
        const announcer = target?.closest('[aria-live]');
        if (announcer?.textContent) {
          const text = `${announcer.getAttribute('aria-live')}: ${announcer.textContent}`;
          setHeard(current => [text, ...current].slice(0, 4));
        }
      }
    });
    announcers.forEach(announcer => observer.observe(announcer, { childList: true, characterData: true }));
    return () => observer.disconnect();
  }, [area]);
  return heard;
}

export default function SaveStatus() {
  const [state, setState] = useState<SaveState>('idle');
  const [failure, setFailure] = useState('');
  const area = useRef<HTMLDivElement>(null);
  const heard = useAnnouncements(area);

  useEffect(() => {
    if (state !== 'saving') {
      return;
    }
    const timer = window.setTimeout(() => setState('saved'), 1500);
    return () => window.clearTimeout(timer);
  }, [state]);

  return (
    <SpaceBetween size="m">
      <SpaceBetween direction="horizontal" size="xs">
        <Button
          variant="primary"
          onClick={() => {
            setFailure('');
            setState('saving');
          }}
        >
          Save draft
        </Button>
        <Button onClick={() => setFailure(`The draft could not be saved at ${new Date().toLocaleTimeString()}.`)}>
          Lose the connection
        </Button>
      </SpaceBetween>
      <div ref={area}>
        <Box>
          Release notes for web:v2.{' '}
          <LiveRegion tagName="span">
            {state === 'idle' && 'Not saved yet.'}
            {state === 'saving' && <StatusIndicator state="loading">Saving</StatusIndicator>}
            {state === 'saved' && <StatusIndicator state="complete">Saved</StatusIndicator>}
          </LiveRegion>
        </Box>
        <LiveRegion assertive={true} hidden={true}>
          {failure}
        </LiveRegion>
      </div>
      <Box fontSize="body-s" color="text-body-secondary">
        Screen reader hears, newest first: {heard.length ? heard.join(' · ') : 'nothing yet'}
      </Box>
    </SpaceBetween>
  );
}
