// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import { InternalFormField } from '../form-field/internal';
import { FormFieldContext } from '../internal/context/form-field-context';
import { AttributeEditorProps } from './interfaces';

// Under shared column headings, a control is named by its column's heading instead of a label of its own.
function LabelledBy({ id, children }: { id: string; children: React.ReactNode }) {
  const field = useContext(FormFieldContext);
  return <FormFieldContext.Provider value={{ ...field, ariaLabelledby: id }}>{children}</FormFieldContext.Provider>;
}

interface AttributeFieldProps<T> {
  definition: AttributeEditorProps.FieldDefinition<T>;
  item: T;
  itemIndex: number;
  /**
   * The ID of the column heading that names the control, when the label is not shown in the row.
   */
  headingId?: string;
}

export function AttributeField<T>({ definition, item, itemIndex, headingId }: AttributeFieldProps<T>) {
  const control = typeof definition.control === 'function' ? definition.control(item, itemIndex) : definition.control;
  const showLabel = headingId === undefined;
  return (
    <InternalFormField
      label={showLabel ? definition.label : undefined}
      info={showLabel ? definition.info : undefined}
      errorText={definition.errorText?.(item, itemIndex)}
      warningText={definition.warningText?.(item, itemIndex)}
      constraintText={definition.constraintText?.(item, itemIndex)}
      stretch={true}
    >
      {headingId && definition.label ? <LabelledBy id={headingId}>{control}</LabelledBy> : control}
    </InternalFormField>
  );
}
