import React, { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleSaved } from '../store/savedSlice';
import { getCoverUrl } from '../api/booksApi';
import { BookDetailRouteProp } from '../navigation/types';

const DetailScreen = () => {
  const route = useRoute<BookDetailRouteProp>();
  const { book } = route.params;
  const dispatch = useAppDispatch();

  const isSaved = useAppSelector(s => s.saved.books.some(b => b.key === book.key));

  const handleToggleSave = useCallback(() => {
    dispatch(toggleSaved(book));
  }, [dispatch, book]);

  const coverUri = book.cover_i ? getCoverUrl(book.cover_i, 'L') : null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" />

      {/* Cover + Save button */}
      <View style={styles.hero}>
        <View style={styles.coverWrapper}>
          {coverUri ? (
            <Image source={{ uri: coverUri }} style={styles.cover} />
          ) : (
            <View style={[styles.cover, styles.coverPlaceholder]}>
              <Text style={styles.coverPlaceholderText}>📖</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isSaved && styles.saveButtonActive]}
          onPress={handleToggleSave}
          activeOpacity={0.8}>
          <Text style={styles.saveButtonText}>
            {isSaved ? '★ Saved' : '☆ Save'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Title & Author */}
      <Text style={styles.title}>{book.title}</Text>
      {book.author_name && book.author_name.length > 0 && (
        <Text style={styles.authors}>
          by {book.author_name.join(', ')}
        </Text>
      )}

      {/* Meta grid */}
      <View style={styles.metaGrid}>
        <MetaItem label="First Published" value={book.first_publish_year?.toString()} />
        <MetaItem label="Editions" value={book.edition_count?.toString()} />
        <MetaItem label="Pages" value={book.number_of_pages_median?.toString()} />
        <MetaItem
          label="Languages"
          value={book.language?.slice(0, 3).join(', ')}
        />
      </View>

      {/* Publishers */}
      {book.publisher && book.publisher.length > 0 && (
        <Section title="Publishers">
          <Text style={styles.bodyText}>
            {book.publisher.slice(0, 5).join(' · ')}
          </Text>
        </Section>
      )}

      {/* ISBN */}
      {book.isbn && book.isbn.length > 0 && (
        <Section title="ISBN">
          <Text style={styles.bodyText}>{book.isbn[0]}</Text>
        </Section>
      )}

      {/* Subjects */}
      {book.subject && book.subject.length > 0 && (
        <Section title="Subjects">
          <View style={styles.tags}>
            {book.subject.slice(0, 10).map((s, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{s}</Text>
              </View>
            ))}
          </View>
        </Section>
      )}
    </ScrollView>
  );
};

const MetaItem = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null;
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  content: {
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: '#1a1a2e',
  },
  coverWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  cover: {
    width: 140,
    height: 200,
    borderRadius: 6,
    resizeMode: 'cover',
  },
  coverPlaceholder: {
    backgroundColor: '#0f3460',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverPlaceholderText: {
    fontSize: 48,
  },
  saveButton: {
    marginTop: 16,
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#7c83fd',
  },
  saveButtonActive: {
    backgroundColor: '#7c83fd',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  title: {
    color: '#e0e0e0',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 20,
    marginHorizontal: 20,
    lineHeight: 30,
  },
  authors: {
    color: '#9e9e9e',
    fontSize: 15,
    marginTop: 6,
    marginHorizontal: 20,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    marginHorizontal: 16,
    gap: 8,
  },
  metaItem: {
    backgroundColor: '#16213e',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: '44%',
    flex: 1,
  },
  metaLabel: {
    color: '#666',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  metaValue: {
    color: '#7c83fd',
    fontSize: 15,
    fontWeight: '700',
  },
  section: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  sectionTitle: {
    color: '#888',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  bodyText: {
    color: '#c0c0c0',
    fontSize: 14,
    lineHeight: 22,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#16213e',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    color: '#9e9e9e',
    fontSize: 12,
  },
});

export default DetailScreen;
