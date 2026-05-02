import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

/**
 * Calls `onForeground` when the app transitions from background → active,
 * and `onBackground` when it transitions from active → background/inactive.
 *
 * Handles all three lifecycle states:
 *   - "active"     — app is in the foreground
 *   - "background" — app is backgrounded (home button, task switcher)
 *   - "inactive"   — transitional (iOS call screen, control centre swipe)
 */
const useAppState = (callbacks: {
  onForeground?: () => void;
  onBackground?: () => void;
}): void => {
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextState: AppStateStatus) => {
        const prevState = appStateRef.current;
        appStateRef.current = nextState;

        if (prevState !== 'active' && nextState === 'active') {
          callbacks.onForeground?.();
        } else if (prevState === 'active' && nextState !== 'active') {
          callbacks.onBackground?.();
        }
      },
    );

    return () => subscription.remove();
    // Callbacks are stable across renders when defined inline; we deliberately
    // skip the dependency array re-run to avoid re-registering the listener on
    // every render. Callers should memoize callbacks with useCallback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useAppState;
