// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

// The build writes one definition per component; see docs/API_DOCS.md.
const srcDir = path.resolve(__dirname, '..');
const definitionsDir = path.resolve(__dirname, '../../lib/components-definitions');
const nonComponents = new Set(['internal', 'i18n']);

interface Entry {
  name: string;
  description: string;
}

interface Definition {
  name: string;
  folder: string;
  properties: Array<Entry & { type: string; optional: boolean; defaultValue?: string; values?: string[] }>;
  regions: Array<Entry & { isDefault: boolean }>;
  events: Array<Entry & { detailType: string; cancelable: boolean }>;
  functions: Array<Entry & { parameters: Array<{ name: string; type: string }>; returnType: string }>;
}

const componentFolders = fs
  .readdirSync(srcDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory() && !nonComponents.has(entry.name) && !entry.name.startsWith('__'))
  .filter(entry => fs.existsSync(path.join(srcDir, entry.name, 'index.tsx')))
  .map(entry => entry.name)
  .sort();

const definitions: Definition[] = componentFolders
  .filter(folder => fs.existsSync(path.join(definitionsDir, `${folder}.json`)))
  .map(folder => JSON.parse(fs.readFileSync(path.join(definitionsDir, `${folder}.json`), 'utf8')));

const find = (folder: string) => definitions.find(definition => definition.folder === folder)!;

describe('API definitions', () => {
  test('exist for every component', () => {
    expect(definitions.map(definition => definition.folder)).toEqual(componentFolders);
  });

  test('every public prop and ref function has a doc comment', () => {
    const undocumented = definitions.flatMap(definition =>
      [...definition.properties, ...definition.regions, ...definition.events, ...definition.functions]
        .filter(entry => entry.description.trim() === '')
        .map(entry => `${definition.name}.${entry.name}`)
    );
    expect(undocumented).toEqual([]);
  });

  test('split props into properties, regions and events', () => {
    const button = find('button');
    expect(button.properties.find(property => property.name === 'variant')).toMatchObject({
      type: 'ButtonProps.Variant',
      optional: true,
      defaultValue: "'normal'",
    });
    expect(button.regions).toContainEqual(expect.objectContaining({ name: 'children', isDefault: true }));
    expect(button.events).toContainEqual(
      expect.objectContaining({ name: 'onClick', detailType: 'ButtonProps.ClickDetail', cancelable: true })
    );
    expect(button.functions).toEqual([
      { name: 'focus', description: 'Moves keyboard focus to the button.', parameters: [], returnType: 'void' },
    ]);
  });

  test('list the values of literal union types', () => {
    const position = find('panel-layout').properties.find(property => property.name === 'panelPosition');
    expect(position?.values).toEqual(['side-start', 'side-end']);
  });

  test('read defaults from the destructuring, constants and doc comments', () => {
    const defaults = (folder: string) =>
      Object.fromEntries(find(folder).properties.map(property => [property.name, property.defaultValue]));
    expect(defaults('panel-layout').defaultPanelSize).toBe('240');
    expect(defaults('slider').step).toBe('1');
  });

  test('include inherited props', () => {
    expect(find('grid').properties.map(property => property.name)).toContain('id');
  });
});
