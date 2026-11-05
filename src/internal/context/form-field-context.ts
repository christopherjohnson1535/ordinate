// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, useContext, useId } from 'react';

import { useBrowserLayoutEffect } from '../hooks/use-browser-layout-effect';

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

export interface FormFieldContextValue extends FormFieldControlProps {
  /**
   * Tells the form field that a choice control with its own label, such as a checkbox, renders the
   * native control with this ID. Returns a function that takes it back.
   */
  registerChoiceControl?: (id: string) => () => void;
}

export const FormFieldContext = createContext<FormFieldContextValue>({});

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

/**
 * The form field context for a checkbox, radio button or toggle. These carry their own label, so they
 * never take the field's control ID: a field can hold several of them, and each needs an ID of its own.
 * The control tells the field its ID instead, so the field can point its label at a single control or
 * label several of them as a group.
 */
export function useChoiceControlFieldContext(props: FormFieldControlProps): FormFieldControlProps {
  const context = useContext(FormFieldContext);
  const generatedId = useId();
  const controlId = props.controlId ?? `${generatedId}control`;
  const register = context.registerChoiceControl;
  useBrowserLayoutEffect(() => register?.(controlId), [register, controlId]);
  return { ...useFormFieldContext(props), controlId };
}
