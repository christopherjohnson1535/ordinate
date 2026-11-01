// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { CodeEditorProps } from './interfaces';
import { InternalCodeEditor } from './internal';

export type { CodeEditorProps };

const CodeEditor = React.forwardRef(
  (
    {
      value,
      onChange,
      onDelayedChange,
      language,
      languageLabel,
      preferences,
      onPreferencesChange,
      editorContentHeight,
      onEditorContentResize,
      loading = false,
      readOnly = false,
      ariaLabel,
      controlId,
      ariaLabelledby,
      ariaDescribedby,
      invalid,
      warning,
      i18nStrings,
      ...props
    }: CodeEditorProps,
    ref: React.Ref<CodeEditorProps.Ref>
  ) => (
    <InternalCodeEditor
      {...getBaseProps(props)}
      ref={ref}
      value={value}
      onChange={onChange}
      onDelayedChange={onDelayedChange}
      language={language}
      languageLabel={languageLabel}
      preferences={preferences}
      onPreferencesChange={onPreferencesChange}
      editorContentHeight={editorContentHeight}
      onEditorContentResize={onEditorContentResize}
      loading={loading}
      readOnly={readOnly}
      ariaLabel={ariaLabel}
      controlId={controlId}
      ariaLabelledby={ariaLabelledby}
      ariaDescribedby={ariaDescribedby}
      invalid={invalid}
      warning={warning}
      i18nStrings={i18nStrings}
    />
  )
);

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor;
