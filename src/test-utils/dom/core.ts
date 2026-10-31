// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

type Act = (callback: () => void) => void;

// React 18.3 and later export `act` from the main package. Older versions run events without it.
const act: Act = (React as unknown as { act?: Act }).act ?? (callback => callback());

export interface ComponentWrapperClass<W extends ComponentWrapper> {
  new (element: HTMLElement): W;
  rootSelector: string;
}

export class ElementWrapper<E extends Element = HTMLElement> {
  constructor(protected readonly element: E) {}

  getElement(): E {
    return this.element;
  }

  find<T extends Element = HTMLElement>(selector: string): ElementWrapper<T> | null {
    const element = this.element.querySelector<T>(selector);
    return element ? new ElementWrapper(element) : null;
  }

  findAll<T extends Element = HTMLElement>(selector: string): ElementWrapper<T>[] {
    return Array.from(this.element.querySelectorAll<T>(selector), element => new ElementWrapper(element));
  }

  findByClassName<T extends Element = HTMLElement>(className: string): ElementWrapper<T> | null {
    return this.find<T>(`.${className}`);
  }

  findAllByClassName<T extends Element = HTMLElement>(className: string): ElementWrapper<T>[] {
    return this.findAll<T>(`.${className}`);
  }

  findComponent<W extends ComponentWrapper>(Wrapper: ComponentWrapperClass<W>, selector = ''): W | null {
    const element = this.element.querySelector<HTMLElement>(`${Wrapper.rootSelector}${selector}`);
    return element ? new Wrapper(element) : null;
  }

  findAllComponents<W extends ComponentWrapper>(Wrapper: ComponentWrapperClass<W>, selector = ''): W[] {
    return Array.from(
      this.element.querySelectorAll<HTMLElement>(`${Wrapper.rootSelector}${selector}`),
      element => new Wrapper(element)
    );
  }

  getText(): string {
    return this.element.textContent ?? '';
  }

  click(init: MouseEventInit = {}): void {
    this.fireEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, ...init }));
  }

  keydown(key: string, init: KeyboardEventInit = {}): void {
    this.fireEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key, ...init }));
  }

  focus(): void {
    act(() => (this.element as unknown as HTMLElement).focus());
  }

  blur(): void {
    act(() => (this.element as unknown as HTMLElement).blur());
  }

  fireEvent(event: Event): void {
    act(() => {
      this.element.dispatchEvent(event);
    });
  }

  /**
   * Sets the value of a native input, select or textarea the way a user would,
   * so React's onChange runs.
   */
  setNativeValue(value: string): void {
    const element = this.element as unknown as HTMLInputElement;
    const prototype = Object.getPrototypeOf(element);
    const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
    act(() => {
      setter?.call(element, value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }
}

export class ComponentWrapper<E extends Element = HTMLElement> extends ElementWrapper<E> {
  static rootSelector: string;
}
