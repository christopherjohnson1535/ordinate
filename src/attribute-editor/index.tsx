// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getBaseProps } from '../internal/base-component';
import { AttributeEditorProps } from './interfaces';
import { InternalAttributeEditor } from './internal';

export type { AttributeEditorProps };

function AttributeEditorWithRef<T>(
  {
    items = [],
    definition,
    onAddButtonClick,
    onRemoveButtonClick,
    addButtonText,
    removeButtonText,
    removeButtonAriaLabel,
    isItemRemovable,
    empty,
    additionalInfo,
    disableAddButton = false,
    gridLayout,
    i18nStrings,
    ...props
  }: AttributeEditorProps<T>,
  ref: React.Ref<AttributeEditorProps.Ref>
) {
  return (
    <InternalAttributeEditor<T>
      {...getBaseProps(props)}
      ref={ref}
      items={items}
      definition={definition}
      onAddButtonClick={onAddButtonClick}
      onRemoveButtonClick={onRemoveButtonClick}
      addButtonText={addButtonText}
      removeButtonText={removeButtonText}
      removeButtonAriaLabel={removeButtonAriaLabel}
      isItemRemovable={isItemRemovable}
      empty={empty}
      additionalInfo={additionalInfo}
      disableAddButton={disableAddButton}
      gridLayout={gridLayout}
      i18nStrings={i18nStrings}
    />
  );
}

const AttributeEditor = React.forwardRef(AttributeEditorWithRef) as (<T>(
  props: AttributeEditorProps<T> & { ref?: React.Ref<AttributeEditorProps.Ref> }
) => React.ReactElement) & { displayName?: string };

AttributeEditor.displayName = 'AttributeEditor';

export default AttributeEditor;
