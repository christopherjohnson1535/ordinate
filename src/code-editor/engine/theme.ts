// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { tags } from '@lezer/highlight';

// The theme reads Ordinate's tokens as custom properties instead of copying their values, so the
// editor follows the revision, the color mode, the density and any runtime theme on its own.
// Code always runs left to right, and CodeMirror's base theme is written with physical
// properties, so these rules use physical properties too, to override it reliably.
const ord = (token: string) => `var(--ord-${token})`;

const rule = (width: string, color: string) => `${width} solid ${color}`;

const controlBorder = rule(ord('border-width-default'), ord('color-border-control'));

const editorTheme = EditorView.theme({
  '&': {
    height: '100%',
    color: ord('color-text-body'),
    // The component paints the background, so read-only editors can use the read-only color.
    backgroundColor: 'transparent',
    fontSize: ord('font-size-code'),
  },
  // The surrounding frame draws the focus ring, so it also covers the status bar edge.
  '&.cm-focused': {
    outline: 'none',
  },
  '.cm-scroller': {
    fontFamily: ord('font-family-mono'),
    lineHeight: ord('line-height-body'),
  },
  '.cm-content': {
    padding: `${ord('space-xxs')} 0`,
    caretColor: ord('color-border-strong'),
  },
  '.cm-line': {
    padding: `0 ${ord('space-xs')}`,
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: ord('color-border-strong'),
  },
  '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
    {
      backgroundColor: ord('color-background-highlight'),
    },
  '.cm-activeLine': {
    backgroundColor: ord('color-background-control-read-only'),
  },
  '.cm-gutters': {
    backgroundColor: ord('color-background-control-read-only'),
    color: ord('color-text-secondary'),
    borderRight: rule(ord('border-width-default'), ord('color-border-divider')),
  },
  '.cm-lineNumbers .cm-gutterElement': {
    padding: `0 ${ord('space-xs')} 0 ${ord('space-s')}`,
  },
  '.cm-activeLineGutter': {
    backgroundColor: ord('color-background-item-hover'),
    color: ord('color-text-body'),
  },
  '&.cm-focused .cm-matchingBracket': {
    backgroundColor: 'transparent',
    outline: controlBorder,
  },
  '&.cm-focused .cm-nonmatchingBracket': {
    backgroundColor: 'transparent',
    color: ord('color-text-error'),
  },
  '.cm-selectionMatch': {
    backgroundColor: ord('color-background-inline-code'),
  },
  '.cm-searchMatch': {
    backgroundColor: ord('color-background-highlight'),
    outline: rule(ord('border-width-default'), ord('color-border-accent')),
  },
  '.cm-searchMatch.cm-searchMatch-selected': {
    backgroundColor: ord('color-background-item-selected'),
  },
  '.cm-placeholder': {
    color: ord('color-text-secondary'),
  },
  '.cm-tooltip': {
    border: rule(ord('border-width-default'), ord('color-border-strong')),
    borderRadius: ord('border-radius-dropdown'),
    backgroundColor: ord('color-background-container'),
    color: ord('color-text-body'),
    fontFamily: ord('font-family-base'),
    fontSize: ord('font-size-body'),
    overflow: 'hidden',
  },
  '.cm-tooltip.cm-tooltip-autocomplete > ul': {
    fontFamily: ord('font-family-mono'),
    fontSize: ord('font-size-code'),
  },
  '.cm-tooltip.cm-tooltip-autocomplete > ul > li': {
    padding: `${ord('space-xxxs')} ${ord('space-xs')}`,
  },
  '.cm-tooltip-autocomplete ul li[aria-selected]': {
    backgroundColor: ord('color-background-item-selected'),
    color: ord('color-text-body'),
  },
  '.cm-completionIcon': {
    color: ord('color-text-secondary'),
  },
  '.cm-completionMatchedText': {
    textDecoration: 'none',
    fontWeight: ord('font-weight-bold'),
  },
  '.cm-completionDetail': {
    color: ord('color-text-secondary'),
    fontStyle: 'normal',
  },
  '.cm-panels': {
    backgroundColor: ord('color-background-container'),
    color: ord('color-text-body'),
    fontFamily: ord('font-family-base'),
    fontSize: ord('font-size-small'),
  },
  '.cm-panels.cm-panels-top': {
    borderBottom: rule(ord('border-width-default'), ord('color-border-divider')),
  },
  '.cm-panels.cm-panels-bottom': {
    borderTop: rule(ord('border-width-default'), ord('color-border-divider')),
  },
  '.cm-panel.cm-search': {
    padding: `${ord('space-xs')} ${ord('space-xl')} ${ord('space-xs')} ${ord('space-s')}`,
  },
  '.cm-panel.cm-search label': {
    fontSize: ord('font-size-small'),
  },
  '.cm-panel.cm-search [name=close]': {
    color: ord('color-text-secondary'),
    fontSize: ord('font-size-heading-s'),
  },
  '.cm-textfield': {
    border: controlBorder,
    borderRadius: ord('border-radius-input'),
    backgroundColor: ord('color-background-control'),
    color: ord('color-text-body'),
    fontFamily: ord('font-family-mono'),
    fontSize: ord('font-size-code'),
    padding: `${ord('space-xxxs')} ${ord('space-xs')}`,
  },
  '.cm-textfield:focus, .cm-button:focus-visible': {
    outline: rule(ord('border-width-focus-ring'), ord('color-border-focus-ring')),
    outlineOffset: ord('border-focus-ring-offset'),
  },
  '.cm-button': {
    border: controlBorder,
    borderRadius: ord('border-radius-button'),
    backgroundColor: ord('color-background-button-normal'),
    backgroundImage: 'none',
    color: ord('color-text-body'),
    fontFamily: ord('font-family-base'),
    fontSize: ord('font-size-small'),
    padding: `${ord('space-xxxs')} ${ord('space-xs')}`,
  },
  '.cm-button:hover': {
    backgroundColor: ord('color-background-button-normal-hover'),
  },
  '.cm-button:active': {
    backgroundColor: ord('color-background-item-selected'),
    backgroundImage: 'none',
  },
  '.cm-lintRange-error, .cm-lintRange-warning': {
    backgroundImage: 'none',
    textDecorationLine: 'underline',
    textDecorationStyle: 'wavy',
    textDecorationSkipInk: 'none',
    textUnderlineOffset: '0.25em',
  },
  '.cm-lintRange-error': {
    textDecorationColor: ord('color-text-error'),
  },
  '.cm-lintRange-warning': {
    textDecorationColor: ord('color-text-status-warning'),
  },
  '.cm-lintPoint:after': {
    borderBottomColor: ord('color-text-error'),
  },
  '.cm-diagnostic': {
    padding: `${ord('space-xxs')} ${ord('space-xs')}`,
  },
  '.cm-diagnostic-error': {
    borderLeft: rule(ord('border-width-section'), ord('color-border-error')),
  },
  '.cm-diagnostic-warning': {
    borderLeft: rule(ord('border-width-section'), ord('color-border-status-warning')),
  },
});

const highlightStyle = HighlightStyle.define([
  {
    tag: [
      tags.keyword,
      tags.controlKeyword,
      tags.operatorKeyword,
      tags.definitionKeyword,
      tags.moduleKeyword,
      tags.modifier,
      tags.self,
    ],
    color: ord('color-text-code-keyword'),
  },
  {
    tag: [tags.string, tags.special(tags.string), tags.regexp, tags.character, tags.inserted, tags.monospace],
    color: ord('color-text-code-string'),
  },
  {
    tag: [tags.number, tags.bool, tags.null, tags.atom, tags.unit, tags.constant(tags.variableName)],
    color: ord('color-text-code-number'),
  },
  {
    tag: [tags.comment, tags.meta, tags.processingInstruction],
    color: ord('color-text-code-comment'),
    fontStyle: 'italic',
  },
  {
    tag: [tags.propertyName, tags.attributeName, tags.tagName, tags.labelName, tags.deleted],
    color: ord('color-text-code-property'),
  },
  {
    tag: [tags.typeName, tags.className, tags.namespace],
    color: ord('color-text-body-secondary'),
  },
  {
    tag: tags.heading,
    color: ord('color-text-code-keyword'),
    fontWeight: ord('font-weight-bold'),
  },
  { tag: tags.strong, fontWeight: ord('font-weight-bold') },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.strikethrough, textDecoration: 'line-through' },
  { tag: [tags.link, tags.url], color: ord('color-text-code-keyword'), textDecoration: 'underline' },
  { tag: tags.invalid, color: ord('color-text-error') },
]);

/**
 * The editor's look, built from Ordinate tokens.
 */
export const ordinateTheme = [editorTheme, syntaxHighlighting(highlightStyle)];
