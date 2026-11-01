// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ensureSyntaxTree, syntaxTree } from '@codemirror/language';
import { Diagnostic, forEachDiagnostic, linter } from '@codemirror/lint';
import { EditorState } from '@codemirror/state';

import { DiagnosticCounts } from './interfaces';

// Long enough to finish parsing typical files, short enough not to block typing on huge ones.
const parseTimeout = 200;

/**
 * Marks the spots where the language's parser had to recover from a syntax error. It works the
 * same for every language, without a separate linter per language.
 */
export function syntaxErrorLinter(getMessage: () => string) {
  return linter(
    view => {
      const tree = ensureSyntaxTree(view.state, view.state.doc.length, parseTimeout) ?? syntaxTree(view.state);
      const diagnostics: Diagnostic[] = [];
      tree.iterate({
        enter: node => {
          if (node.type.isError) {
            diagnostics.push({ from: node.from, to: node.to, severity: 'error', message: getMessage() });
          }
        },
      });
      return diagnostics;
    },
    {
      delay: 500,
      // A language that finishes loading after the code is in place needs a fresh check.
      needsRefresh: update => update.transactions.some(transaction => transaction.reconfigured),
    }
  );
}

export function countDiagnostics(state: EditorState): DiagnosticCounts {
  const counts: DiagnosticCounts = { errors: 0, warnings: 0 };
  forEachDiagnostic(state, diagnostic => {
    if (diagnostic.severity === 'error') {
      counts.errors++;
    } else if (diagnostic.severity === 'warning') {
      counts.warnings++;
    }
  });
  return counts;
}
