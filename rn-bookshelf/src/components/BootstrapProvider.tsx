import React from 'react';
import usePersistence from '../hooks/usePersistence';

/**
 * Thin wrapper that runs app-level bootstrap hooks (persistence hydration,
 * etc.) without polluting App.tsx with hook calls.
 */
const BootstrapProvider = ({ children }: { children: React.ReactNode }) => {
  usePersistence();
  return <>{children}</>;
};

export default BootstrapProvider;
