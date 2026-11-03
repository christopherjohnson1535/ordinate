// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc, Definition, GroupId, LoadedExample } from './types';

// Every component page is a folder under content/components: an index.tsx with the page's text
// and an examples/ folder with one runnable file per example. The page text loads up front, for the
// navigation and search; examples, their source and the API definitions load with the page.
const docModules = import.meta.glob<{ default: ComponentDoc }>('../content/components/*/index.tsx', { eager: true });
const exampleModules = import.meta.glob<{ default: React.ComponentType }>('../content/components/*/examples/*.tsx');
const exampleSources = import.meta.glob<string>('../content/components/*/examples/*.tsx', {
  query: '?raw',
  import: 'default',
});
const componentDefinitions = import.meta.glob<Definition>('../../../lib/components-definitions/*.json', {
  import: 'default',
});
const chartDefinitions = import.meta.glob<Definition>('../../../lib/charts-definitions/*.json', {
  import: 'default',
});

export interface Group {
  id: GroupId;
  title: string;
  /** One sentence for the component index. */
  summary: string;
}

export const groups: ReadonlyArray<Group> = [
  { id: 'layout', title: 'Layout', summary: 'The frame of a page and the regions inside it.' },
  { id: 'content', title: 'Content', summary: 'Headings, text and the boxes that hold them.' },
  { id: 'code-and-drawings', title: 'Code and drawings', summary: 'Code, terminals, schematics and maps.' },
  { id: 'collections', title: 'Collections', summary: 'Tables, cards and lists, and the tools to filter them.' },
  { id: 'actions', title: 'Actions', summary: 'Buttons, links and the controls that run a command.' },
  { id: 'forms', title: 'Forms', summary: 'Fields, choices and the layout that labels them.' },
  { id: 'dates-and-files', title: 'Dates and files', summary: 'Picking dates and times, and adding files.' },
  { id: 'navigation', title: 'Navigation', summary: 'Moving between pages, sections and items.' },
  { id: 'guided-flows', title: 'Guided flows', summary: 'Steps, wizards and help that walks alongside.' },
  { id: 'overlays', title: 'Overlays', summary: 'Plates lifted off the sheet: modals, popovers, menus.' },
  { id: 'status', title: 'Status and feedback', summary: 'How something is, and what just happened.' },
  { id: 'icons', title: 'Icons', summary: 'The icon set and how to bring your own.' },
  { id: 'website-frame', title: 'Website frame', summary: 'The header, footer and sections of a website.' },
  { id: 'website-content', title: 'Website content', summary: 'Articles, figures, quotes and story cards.' },
  { id: 'website-flows', title: 'Website flows', summary: 'Opening hours, journeys and how-it-works strips.' },
  { id: 'charts', title: 'Charts', summary: 'Line, area, bar and pie charts from @ordinate/charts.' },
];

const folderOf = (file: string) => file.split('/').slice(-2, -1)[0];
const exampleKey = (folder: string, id: string) => `../content/components/${folder}/examples/${id}.tsx`;

const groupOrder = new Map(groups.map((group, index) => [group.id, index]));

export const componentDocs: ReadonlyArray<ComponentDoc> = Object.entries(docModules)
  .map(([file, module]) => {
    const doc = module.default;
    if (doc.folder !== folderOf(file)) {
      console.error(`[docs] ${file} names folder "${doc.folder}".`);
    }
    return doc;
  })
  .sort((a, b) => (groupOrder.get(a.group) ?? 0) - (groupOrder.get(b.group) ?? 0) || a.name.localeCompare(b.name));

const byFolder = new Map(componentDocs.map(doc => [doc.folder, doc]));

export function findComponentDoc(folder: string): ComponentDoc | undefined {
  return byFolder.get(folder);
}

export function componentsInGroup(group: GroupId): ReadonlyArray<ComponentDoc> {
  return componentDocs.filter(doc => doc.group === group);
}

/** The examples of one component, in the order its page lists them, ready to load. */
export function examplesOf(doc: ComponentDoc): ReadonlyArray<LoadedExample> {
  return doc.examples.map(meta => {
    const key = exampleKey(doc.folder, meta.id);
    const load = exampleModules[key];
    const loadSource = exampleSources[key];
    if (!load || !loadSource) {
      const missing = () =>
        Promise.reject(new Error(`No example file at content/components/${doc.folder}/examples/${meta.id}.tsx`));
      return { meta, load: missing, loadSource: missing };
    }
    return { meta, load, loadSource };
  });
}

/** Loads the API definition the build wrote for a component, or `null` when there is none. */
export function loadDefinition(doc: ComponentDoc): Promise<Definition | null> {
  const definitions = doc.package === 'charts' ? chartDefinitions : componentDefinitions;
  const directory = doc.package === 'charts' ? 'charts-definitions' : 'components-definitions';
  const load = definitions[`../../../lib/${directory}/${doc.folder}.json`];
  return load ? load() : Promise.resolve(null);
}

/** The import an application writes for the component. */
export function importPathOf(doc: ComponentDoc): string {
  return doc.package === 'charts' ? `@ordinate/charts/${doc.folder}` : `@ordinate/components/${doc.folder}`;
}

/** A sheet number for a component page, such as `C-014`, from its place in the index. */
export function sheetOfComponent(doc: ComponentDoc): string {
  return `C-${String(componentDocs.indexOf(doc) + 1).padStart(3, '0')}`;
}
