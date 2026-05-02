import React, { memo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Book } from '../types';
import { getCoverUrl } from '../api/booksApi';

interface Props {
  book: Book;
  onPress: (book: Book) => void;
  onSaveToggle: (book: Book) => void;
  isSaved: boolean;
}

const BookCard = ({ book, onPress, onSaveToggle, isSaved }: Props) => {
  const coverUri = book.cover_i ? getCoverUrl(book.cover_i, 'S') : null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(book)}
      activeOpacity={0.75}>
      <View style={styles.cover}>
        {coverUri ? (
          <Image source={{ uri: coverUri }} style={styles.coverImage} />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Text style={styles.coverPlaceholderText}>📖</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        {book.author_name && book.author_name.length > 0 && (
          <Text style={styles.author} numberOfLines={1}>
            {book.author_name.slice(0, 2).join(', ')}
          </Text>
        )}
        <View style={styles.meta}>
          {book.first_publish_year != null && (
            <Text style={styles.metaText}>{book.first_publish_year}</Text>
          )}
          {book.edition_count != null && (
            <Text style={styles.metaText}>{book.edition_count} editions</Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={() => onSaveToggle(book)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={[styles.saveIcon, isSaved && styles.saveIconActive]}>
          {isSaved ? '★' : '☆'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    borderRadius: 10,
    marginHorizontal: 12,
    marginVertical: 5,
    padding: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  cover: {
    width: 54,
    height: 78,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#0f3460',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverPlaceholderText: {
    fontSize: 24,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  title: {
    color: '#e0e0e0',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  author: {
    color: '#9e9e9e',
    fontSize: 13,
    marginTop: 3,
  },
  meta: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  metaText: {
    color: '#7c83fd',
    fontSize: 11,
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  saveBtn: {
    paddingHorizontal: 4,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  saveIcon: {
    fontSize: 22,
    color: '#555',
  },
  saveIconActive: {
    color: '#7c83fd',
  },
});

export default memo(BookCard);
