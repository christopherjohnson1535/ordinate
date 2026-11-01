// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext } from 'react';

/**
 * What a question in a `Journey` shares with the answers placed in it. Choice controls such as
 * `Tiles` use it to take the large answer look and to be named by the question when nothing else
 * names them.
 */
export interface QuestionContextValue {
  /**
   * ID of the element holding the question's text.
   */
  questionId: string;
  /**
   * ID of the question's description, if it has one.
   */
  descriptionId?: string;
}

export const QuestionContext = createContext<QuestionContextValue | null>(null);
