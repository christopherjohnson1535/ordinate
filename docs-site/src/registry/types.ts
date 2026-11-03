// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

/** The groups of the component index, in the order the README lists them. */
export type GroupId =
  | 'layout'
  | 'content'
  | 'code-and-drawings'
  | 'collections'
  | 'actions'
  | 'forms'
  | 'dates-and-files'
  | 'navigation'
  | 'guided-flows'
  | 'overlays'
  | 'status'
  | 'icons'
  | 'website-frame'
  | 'website-content'
  | 'website-flows'
  | 'charts';

/** The marks of the design language, M1 to M13. */
export type MarkId = 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M6' | 'M7' | 'M8' | 'M9' | 'M10' | 'M11' | 'M12' | 'M13';

/**
 * How an example sits in its frame:
 * - `padded`: on the sheet with the usual margin, aligned to the start. The default.
 * - `centered`: in the middle of the sheet, for a single small control.
 * - `flush`: edge to edge with no margin, for layouts that bring their own frame.
 */
export type ExampleLayout = 'padded' | 'centered' | 'flush';

/** A fixed frame height, for components that fill their parent. Leave it out to fit the content. */
export type ExampleHeight = 'short' | 'medium' | 'tall';

export interface ExampleMeta {
  /** The file name in the component's `examples` folder, without `.tsx`. */
  id: string;
  title: string;
  /** One or two sentences: what the example shows and when to reach for it. */
  description?: React.ReactNode;
  layout?: ExampleLayout;
  height?: ExampleHeight;
}

export interface Guidelines {
  /** When the component is the right choice. */
  use?: ReadonlyArray<React.ReactNode>;
  /** When to pick something else, naming the alternative where there is one. */
  avoid?: ReadonlyArray<React.ReactNode>;
  /** How to word the text the component shows. */
  writing?: ReadonlyArray<React.ReactNode>;
}

export interface ComponentDoc {
  /** The component's name as it is imported, such as `Button`. */
  name: string;
  /** The package folder, such as `button`. It is also the URL slug and the API definition's name. */
  folder: string;
  group: GroupId;
  /** Which package the component ships in. Defaults to `components`. */
  package?: 'components' | 'charts';
  /** One sentence for the index and search results. */
  summary: string;
  /** The opening paragraphs of the page. */
  description?: React.ReactNode;
  /** The design-language marks the component draws. */
  marks?: ReadonlyArray<MarkId>;
  examples: ReadonlyArray<ExampleMeta>;
  guidelines?: Guidelines;
  /** What the component does for keyboard and screen reader users, and what is left to the application. */
  accessibility?: ReadonlyArray<React.ReactNode>;
  /** Folders of components to read next. */
  related?: ReadonlyArray<string>;
  /**
   * Whether the test utilities have a finder for it, `createWrapper().find<Name>()`. Defaults to
   * `true`; set it to `false` for components that render nothing of their own, such as providers.
   */
  testing?: boolean;
}

/** One lazily loaded example: the component that runs and the source shown beside it. */
export interface LoadedExample {
  meta: ExampleMeta;
  load: () => Promise<{ default: React.ComponentType }>;
  loadSource: () => Promise<string>;
}

// The shape of lib/components-definitions/<folder>.json, written by build-tools/tasks/docs.js.
export interface DefinitionProperty {
  name: string;
  type: string;
  optional: boolean;
  description?: string;
  defaultValue?: string;
  values?: ReadonlyArray<string>;
  deprecated?: string;
}

export interface DefinitionRegion {
  name: string;
  description?: string;
  isDefault: boolean;
}

export interface DefinitionEvent {
  name: string;
  description?: string;
  detailType?: string;
  cancelable: boolean;
}

export interface DefinitionFunction {
  name: string;
  description?: string;
  parameters: ReadonlyArray<{ name: string; type: string }>;
  returnType: string;
}

export interface Definition {
  name: string;
  folder: string;
  properties: ReadonlyArray<DefinitionProperty>;
  regions: ReadonlyArray<DefinitionRegion>;
  events: ReadonlyArray<DefinitionEvent>;
  functions: ReadonlyArray<DefinitionFunction>;
}
