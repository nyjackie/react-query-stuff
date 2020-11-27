import React, { useState } from 'react';
import { cn } from 'gdd-components/dist/utils';
import styles from './Nav.module.scss';

/**
 * This component handles expand/collapsing a nav component. super simple
 */
function NavCollapsed({ children, title, open = false }) {
  const [isOpen, setIsOpen] = useState(open);

  return (
    <>
      <div
        className={cn(styles.collapsedTitle, isOpen && styles.open)}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {title}
      </div>
      <div className={cn(isOpen && styles.open, styles.collapsedContent)}>{children}</div>
    </>
  );
}

export default NavCollapsed;
