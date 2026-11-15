import React, { forwardRef, useEffect, useState } from 'react';

// Preserve the supplied theme's markup while linking to the existing school portal.
const destinations: Record<string, string> = {
  '/': '/', '/about': '/#about', '/contact': '/#contact',
  '/admissions': '/admission', '/login': '/login', '/dashboard': '/dashboard',
};
export const Link = forwardRef<HTMLAnchorElement, any>(({to, children, activeOptions, ...props}, ref) => {
  const isActive = to === '/';
  return <a {...props} ref={ref} href={destinations[to] || to} data-status={isActive ? 'active' : undefined}>
    {typeof children === 'function' ? children({isActive}) : children}
  </a>;
});
export const createFileRoute = (_path: string) => (options: any) => options;
export function ClientOnly({children, fallback}: {children: React.ReactNode; fallback?: React.ReactNode}) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready ? children : fallback;
}
