// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Extension } from '@codemirror/state';

import { CodeEditorProps } from '../interfaces';

/**
 * Loads the language support for `language`. Each language package is its own chunk, so an
 * editor for JSON never downloads the Python parser.
 */
export async function loadLanguage(language: CodeEditorProps.Language): Promise<Extension> {
  switch (language) {
    case 'javascript':
      return (await import('@codemirror/lang-javascript')).javascript();
    case 'typescript':
      return (await import('@codemirror/lang-javascript')).javascript({ typescript: true });
    case 'json':
      return (await import('@codemirror/lang-json')).json();
    case 'yaml':
      return (await import('@codemirror/lang-yaml')).yaml();
    case 'html':
      return (await import('@codemirror/lang-html')).html();
    case 'css':
      return (await import('@codemirror/lang-css')).css();
    case 'python':
      return (await import('@codemirror/lang-python')).python();
    case 'markdown':
      return (await import('@codemirror/lang-markdown')).markdown();
    default:
      return [];
  }
}
