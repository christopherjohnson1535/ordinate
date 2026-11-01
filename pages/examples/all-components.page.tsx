// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ActionsGroup from './all-components/actions';
import ChartsGroup from './all-components/charts';
import CollectionsGroup from './all-components/collections';
import ContentGroup from './all-components/content';
import DatesAndFilesGroup from './all-components/dates-and-files';
import FormsGroup from './all-components/forms';
import GuidedFlowsGroup from './all-components/guided-flows';
import IconsGroup from './all-components/icons';
import LayoutGroup from './all-components/layout';
import NavigationGroup from './all-components/navigation';
import OverlaysGroup from './all-components/overlays';
import StatusGroup from './all-components/status';
import WebsiteContentGroup from './all-components/website-content';
import WebsiteFlowsGroup from './all-components/website-flows';
import WebsiteFrameGroup from './all-components/website-frame';

import styles from './all-components/specimen.module.scss';

// The groups follow the README's list of components, in the same order.
const groups = [
  LayoutGroup,
  ContentGroup,
  CollectionsGroup,
  ActionsGroup,
  FormsGroup,
  DatesAndFilesGroup,
  NavigationGroup,
  GuidedFlowsGroup,
  OverlaysGroup,
  StatusGroup,
  IconsGroup,
  WebsiteFrameGroup,
  WebsiteContentGroup,
  WebsiteFlowsGroup,
  ChartsGroup,
];

export default function AllComponents() {
  return (
    <article className={styles.page}>
      <div className={styles.intro}>
        <h1>Every component</h1>
        <p>
          The whole library on one sheet, each component with a small working example. Change the mode, revision, style,
          density or direction in the top bar to see every part change at once.
        </p>
      </div>
      {groups.map((GroupSection, index) => (
        <GroupSection key={index} number={index + 1} />
      ))}
    </article>
  );
}
