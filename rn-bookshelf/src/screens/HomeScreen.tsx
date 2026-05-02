import React, { useCallback, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
  ListRenderItemInfo,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchBooks, setQuery, resetSearch } from '../store/booksSlice';
import { toggleSaved } from '../store/savedSlice';
import useAppState from '../hooks/useAppState';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';
import EmptyState from '../components/EmptyState';
import { Book } from '../types';
import { BookListNavigationProp } from '../navigation/types';

const FOOTER_HEIGHT = 60;

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<BookListNavigationProp>();

  const { items, query, page, loading, loadingMore, error, hasMore, totalFound } =
    useAppSelector(s => s.books);
  const savedKeys = useAppSelector(s =>
    new Set(s.saved.books.map(b => b.key)),
  );

  // Track whether we've run the initial restore-and-fetch
  const didInitialFetch = useRef(false);

  // When the app comes back to foreground, silently refresh page 1
  const handleForeground = useCallback(() => {
    if (query.trim()) {
      dispatch(fetchBooks({ query, page: 1 }));
    }
  }, [dispatch, query]);

  useAppState({ onForeground: handleForeground });

  // On mount, if we restored a query from storage, trigger a search
  useEffect(() => {
    if (!didInitialFetch.current && query.trim()) {
      didInitialFetch.current = true;
      dispatch(fetchBooks({ query, page: 1 }));
    }
  // Only run when query is first hydrated from storage
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleSearch = useCallback(
    (q: string) => {
      dispatch(setQuery(q));
      dispatch(resetSearch());
      dispatch(fetchBooks({ query: q, page: 1 }));
      didInitialFetch.current = true;
    },
    [dispatch],
  );

  const handleQueryChange = useCallback(
    (text: string) => {
      dispatch(setQuery(text));
    },
    [dispatch],
  );

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && query.trim()) {
      dispatch(fetchBooks({ query, page: page + 1 }));
    }
  }, [dispatch, hasMore, loadingMore, page, query]);

  const handleBookPress = useCallback(
    (book: Book) => navigation.navigate('BookDetail', { book }),
    [navigation],
  );

  const handleSaveToggle = useCallback(
    (book: Book) => dispatch(toggleSaved(book)),
    [dispatch],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Book>) => (
      <BookCard
        book={item}
        onPress={handleBookPress}
        onSaveToggle={handleSaveToggle}
        isSaved={savedKeys.has(item.key)}
      />
    ),
    [handleBookPress, handleSaveToggle, savedKeys],
  );

  const keyExtractor = useCallback((item: Book) => item.key, []);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator color="#7c83fd" size="small" />
      </View>
    );
  };

  const renderHeader = () =>
    items.length > 0 ? (
      <Text style={styles.resultCount}>
        {totalFound.toLocaleString()} results · showing {items.length}
      </Text>
    ) : null;

  return (
    <View style={styles.container}>
      <SearchBar
        value={query}
        onSubmit={handleSearch}
        onChangeText={handleQueryChange}
      />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color="#7c83fd" size="large" />
          <Text style={styles.loadingText}>Searching…</Text>
        </View>
      ) : error ? (
        <EmptyState
          icon="⚠️"
          title="Something went wrong"
          subtitle={error}
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon="📚"
          title={query.trim() ? 'No results found' : 'Search for books'}
          subtitle={
            query.trim()
              ? 'Try a different search term'
              : 'Type a title, author, or topic above'
          }
        />
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListFooterComponentStyle={{ height: FOOTER_HEIGHT }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          // Performance tuning
          initialNumToRender={12}
          maxToRenderPerBatch={10}
          windowSize={7}
          removeClippedSubviews={true}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#888',
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 16,
  },
  resultCount: {
    color: '#666',
    fontSize: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});

export default HomeScreen;
