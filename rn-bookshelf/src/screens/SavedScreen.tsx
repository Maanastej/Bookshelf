import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ListRenderItemInfo,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleSaved } from '../store/savedSlice';
import BookCard from '../components/BookCard';
import EmptyState from '../components/EmptyState';
import { Book } from '../types';
import { BookListNavigationProp } from '../navigation/types';

const SavedScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<BookListNavigationProp>();
  const savedBooks = useAppSelector(s => s.saved.books);

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
        isSaved={true}
      />
    ),
    [handleBookPress, handleSaveToggle],
  );

  const keyExtractor = useCallback((item: Book) => item.key, []);

  if (savedBooks.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="★"
          title="No saved books yet"
          subtitle="Tap the star icon on any book to save it here. Your list persists across app restarts."
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={savedBooks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        initialNumToRender={12}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },
});

export default SavedScreen;
