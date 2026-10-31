// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, useContext } from 'react';

export interface FormFieldControlProps {
  /**
   * ID of the native control. Usually set by the surrounding `FormField`.
   */
  controlId?: string;
  /**
   * IDs of the elements that label the control. Usually set by the surrounding `FormField`.
   */
  ariaLabelledby?: string;
  /**
   * IDs of the elements that describe the control. Usually set by the surrounding `FormField`.
   */
  ariaDescribedby?: string;
  /**
   * Marks the control as invalid. Usually set by the `errorText` of the surrounding `FormField`.
   */
  invalid?: boolean;
  /**
   * Shows the control in a warning state. Usually set by the `warningText` of the surrounding `FormField`.
   * When you set it yourself, describe the warning with `ariaDescribedby`.
   */
  warning?: boolean;
}

export const FormFieldContext = createContext<FormFieldControlProps>({});

/**
 * Lets a control pick up its label, description and validation state from the
 * surrounding form field. Props set directly on the control win.
 */
export function useFormFieldContext(props: FormFieldControlProps): FormFieldControlProps {
  const context = useContext(FormFieldContext);
  return {
    controlId: props.controlId ?? context.controlId,
    ariaLabelledby: props.ariaLabelledby ?? context.ariaLabelledby,
    ariaDescribedby: props.ariaDescribedby ?? context.ariaDescribedby,
    invalid: props.invalid ?? context.invalid,
    warning: props.warning ?? context.warning,
  };
}
