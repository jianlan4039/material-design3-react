/**
 * Copyright (c) 2024 jian lan
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { forwardRef, useMemo, useCallback } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { createPortal } from 'react-dom';

import classNames from '@utils/classnames';
import useElevation from '../Elevation';
import styles from './index.module.scss';

/**
 * Dialog Component Props Interface
 *
 * Extends all native HTML div element attributes and provides slots
 * for dialog content areas (header, content, actions).
 *
 * @extends React.HTMLAttributes<HTMLDivElement>
 */
export interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the dialog is open
   *
   * Controls the visibility of the dialog. When false, the dialog is not rendered.
   *
   * @default false
   *
   * @example
   * ```tsx
   * <Dialog open={isOpen}>Dialog content</Dialog>
   * ```
   */
  open?: boolean;

  /**
   * Callback when scrim (background overlay) is clicked
   *
   * Called when the user clicks on the scrim (the dark overlay behind the dialog).
   * Typically used to close the dialog.
   *
   * @example
   * ```tsx
   * <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
   *   Dialog content
   * </Dialog>
   * ```
   */
  onClose?: () => void;

  /**
   * Dialog title (headline)
   *
   * Renders as the dialog's headline/title in the header section.
   * Uses Material Design 3 headline-small typography.
   *
   * @example
   * ```tsx
   * <Dialog headline="Confirm Action">Content here</Dialog>
   * ```
   */
  headline?: ReactNode;

  /**
   * Dialog description (supporting text)
   *
   * Renders as supporting text below the headline in the header section.
   * Uses Material Design 3 body-medium typography.
   *
   * @example
   * ```tsx
   * <Dialog
   *   headline="Confirm Action"
   *   supportingText="This action cannot be undone."
   * >
   *   Content here
   * </Dialog>
   * ```
   */
  supportingText?: ReactNode;

  /**
   * Action buttons rendered at bottom
   *
   * Renders in the footer section, typically used for action buttons.
   * Buttons are aligned to the end (right in LTR).
   *
   * @example
   * ```tsx
   * <Dialog
   *   headline="Delete item?"
   *   actions={
   *     <>
   *       <Button variant="text" onClick={onCancel}>Cancel</Button>
   *       <Button variant="filled" onClick={onDelete}>Delete</Button>
   *     </>
   *   }
   * >
   *   This action is permanent.
   * </Dialog>
   * ```
   */
  actions?: ReactNode;

  /**
   * Element type for content wrapper
   *
   * Determines the HTML element type used for the content wrapper.
   * Use 'section' for semantic markup when content is a distinct section.
   *
   * @default 'div'
   *
   * @example
   * ```tsx
   * <Dialog contentElement="section">
   *   <List>...</List>
   * </Dialog>
   * ```
   */
  contentElement?: 'div' | 'section';

  /**
   * Content passed as children
   *
   * Renders in the content area between header and actions.
   * Can include lists, forms, or any custom content.
   *
   * @example
   * ```tsx
   * <Dialog headline="Select item">
   *   <List>
   *     <ListItem>Item 1</ListItem>
   *     <ListItem>Item 2</ListItem>
   *   </List>
   * </Dialog>
   * ```
   */
  children?: ReactNode;
}

/**
 * Dialog Component
 *
 * Material Design 3 dialog component that displays a modal dialog.
 * Supports header (headline + supporting text), content area, and action buttons.
 *
 * The dialog renders using React portals to ensure proper z-index stacking.
 *
 * @component
 * @example
 * ```tsx
 * // Basic dialog with headline and actions
 * <Dialog
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   headline="Basic dialog title"
 *   supportingText="A dialog is a type of modal window..."
 *   actions={
 *     <>
 *       <Button variant="text">Cancel</Button>
 *       <Button variant="filled">OK</Button>
 *     </>
 *   }
 * />
 *
 * // Dialog with list content
 * <Dialog
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   headline="Select an option"
 * >
 *   <List>
 *     <ListItem>Option 1</ListItem>
 *     <ListItem>Option 2</ListItem>
 *     <ListItem>Option 3</ListItem>
 *   </List>
 * </Dialog>
 * ```
 */
export const Dialog = forwardRef<HTMLDivElement, DialogProps>(({
  open = false,
  onClose,
  headline,
  supportingText,
  actions,
  children,
  className,
  contentElement: ContentTag = 'div',
  ...restProps
}, ref) => {
  // Return null if dialog is not open
  if (!open) {
    return null;
  }

  // Build class names for dialog container
  const dialogClassName = useMemo(() => {
    return classNames(styles['nd-dialog']).add(className);
  }, [className]);

  // Apply elevation effect
  const classNameWithElevation = useElevation(
    {
      classNameManager: dialogClassName,
      disabled: false,
    },
    []
  );

  // Handle scrim click
  const handleScrimClick = useCallback(() => {
    onClose?.();
  }, [onClose]);

  // Handle dialog click (prevent propagation to scrim)
  const handleDialogClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  }, []);

  // Determine if header should be rendered
  const hasHeader = headline || supportingText;

  // Portal content
  const dialogContent = (
    <div
      className={styles['nd-dialog__scrim']}
      onClick={handleScrimClick}
      role="presentation"
    >
      <div
        ref={ref}
        className={classNameWithElevation.toString()}
        onClick={handleDialogClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headline ? 'dialog-headline' : undefined}
        aria-describedby={supportingText ? 'dialog-supporting-text' : undefined}
        style={{
          '--md-elevation-level': 'var(--md-comp-dialog-container-elevation, 3)',
          '--md-elevation-shadow-color': 'var(--md-sys-color-shadow, rgba(0, 0, 0, 0.15))',
        } as React.CSSProperties}
        {...restProps}
      >
        {/* Header section */}
        {hasHeader && (
          <header className={styles['nd-dialog__header']}>
            {headline && (
              <h2
                id="dialog-headline"
                className={styles['nd-dialog__headline']}
              >
                {headline}
              </h2>
            )}
            {supportingText && (
              <p
                id="dialog-supporting-text"
                className={styles['nd-dialog__supporting-text']}
              >
                {supportingText}
              </p>
            )}
          </header>
        )}

        {/* Content section */}
        {children && (
          <ContentTag className={styles['nd-dialog__content']}>
            {children}
          </ContentTag>
        )}

        {/* Actions section */}
        {actions && (
          <footer className={styles['nd-dialog__actions']}>
            {actions}
          </footer>
        )}
      </div>
    </div>
  );

  // Render using portal
  return createPortal(dialogContent, document.body);
});

Dialog.displayName = 'Dialog';

export default Dialog;
