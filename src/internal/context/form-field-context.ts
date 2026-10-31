// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, useContext } from 'react';

export interface FormFieldControlProps {
  controlId?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  invalid?: boolean;
}

export const FormFieldContext = createContext<FormFieldControlProps>({});

/**
 * Lets a control pick up its label, description and error state from the
 * surrounding form field. Props set directly on the control win.
 */
export function useFormFieldContext(props: FormFieldControlProps): FormFieldControlProps {
  const context = useContext(FormFieldContext);
  return {
    controlId: props.controlId ?? context.controlId,
    ariaLabelledby: props.ariaLabelledby ?? context.ariaLabelledby,
    ariaDescribedby: props.ariaDescribedby ?? context.ariaDescribedby,
    invalid: props.invalid ?? context.invalid,
  };
}
