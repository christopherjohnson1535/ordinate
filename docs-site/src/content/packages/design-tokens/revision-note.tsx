// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '@ordinate/components/button';
import SpaceBetween from '@ordinate/components/space-between';
import {
  borderWidthDefault,
  colorBorderDivider,
  colorKindConfiguration,
  colorTextBody,
  colorTextBodySecondary,
  fontFamilyMono,
  fontSizeCaption,
  fontSizeSmall,
  letterSpacingCaption,
  sizeKeySquare,
  sizeMarginColumn,
  spaceS,
  spaceScaledM,
  spaceXs,
} from '@ordinate/design-tokens';

interface Note {
  reference: string;
  date: string;
  text: string;
}

// A revision schedule, as in the corner of a drawing: a custom element, styled only with tokens, so it
// follows the mode, revision, density and theme like the components around it.
function RevisionSchedule({ notes }: { notes: ReadonlyArray<Note> }) {
  return (
    <ol style={{ margin: 0, padding: 0, listStyle: 'none', color: colorTextBody }}>
      {notes.map(note => (
        <li
          key={note.reference}
          style={{
            display: 'grid',
            gridTemplateColumns: `${sizeMarginColumn} 1fr`,
            gap: spaceS,
            paddingBlock: spaceScaledM,
            borderBlockStart: `${borderWidthDefault} solid ${colorBorderDivider}`,
          }}
        >
          <span style={{ display: 'flex', gap: spaceXs, alignItems: 'baseline', fontFamily: fontFamilyMono }}>
            <span
              aria-hidden="true"
              style={{ inlineSize: sizeKeySquare, blockSize: sizeKeySquare, background: colorKindConfiguration }}
            />
            <span style={{ color: colorKindConfiguration }}>{note.reference}</span>
            <span
              style={{
                color: colorTextBodySecondary,
                fontSize: fontSizeCaption,
                letterSpacing: letterSpacingCaption,
                textTransform: 'uppercase',
              }}
            >
              {note.date}
            </span>
          </span>
          <span style={{ fontSize: fontSizeSmall }}>{note.text}</span>
        </li>
      ))}
    </ol>
  );
}

const later: Note = { reference: '△3', date: '2 Nov 2026', text: 'Raised the node limit to 32 for the winter exhibition.' };

export default function RevisionNote() {
  const [notes, setNotes] = useState<Note[]>([
    { reference: '△1', date: '12 Sep 2026', text: 'First issue. Twenty nodes in us-mountain-1.' },
    { reference: '△2', date: '31 Oct 2026', text: 'Moved backups to the nightly window. Checked by D. Ruiz.' },
  ]);

  return (
    <SpaceBetween size="m">
      <RevisionSchedule notes={notes} />
      <Button disabled={notes.includes(later)} onClick={() => setNotes(current => [...current, later])}>
        Add revision △3
      </Button>
    </SpaceBetween>
  );
}
