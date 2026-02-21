import React from 'react';

export const triggerComingSoon = (e?: React.MouseEvent | MouseEvent) => {
  const detail = e ? { x: e.clientX, y: e.clientY } : undefined;
  window.dispatchEvent(new CustomEvent('show-coming-soon', { detail }));
};
