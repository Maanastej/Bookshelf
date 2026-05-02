import { useEffect } from 'react';
import { useAppDispatch } from '../store';
import { hydrateSaved } from '../store/savedSlice';
import { restoreQuery } from '../store/booksSlice';
import { loadSavedBooks, loadLastQuery } from '../utils/storage';

/**
 * Runs once on app mount. Reads AsyncStorage and rehydrates Redux state
 * with persisted saved books and the last search query.
 */
const usePersistence = (): void => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const hydrate = async () => {
      const [savedBooks, lastQuery] = await Promise.all([
        loadSavedBooks(),
        loadLastQuery(),
      ]);
      dispatch(hydrateSaved(savedBooks));
      if (lastQuery) {
        dispatch(restoreQuery(lastQuery));
      }
    };

    hydrate();
  }, [dispatch]);
};

export default usePersistence;
