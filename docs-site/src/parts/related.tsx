// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ActionCard from '@ordinate/components/action-card';

import { href } from '../app/router';
import { findComponentDoc } from '../registry/components';

import styles from './related.module.scss';

/** Cards that lead to other component pages, each with its summary. */
export function RelatedCards({ folders }: { folders: ReadonlyArray<string> }) {
  const docs = folders.map(folder => findComponentDoc(folder)).filter(doc => doc !== undefined);
  return (
    <ul className={styles.grid}>
      {docs.map(doc => (
        <li key={doc.folder}>
          <ActionCard href={href(`/components/${doc.folder}`)} header={doc.name} description={doc.summary} />
        </li>
      ))}
    </ul>
  );
}
