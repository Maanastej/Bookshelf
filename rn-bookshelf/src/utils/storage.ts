import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book } from '../types';

const SAVED_BOOKS_KEY = '@bookshelf:saved_books';
const LAST_QUERY_KEY = '@bookshelf:last_query';

export const loadSavedBooks = async (): Promise<Book[]> => {
  try {
    const raw = await AsyncStorage.getItem(SAVED_BOOKS_KEY);
    return raw ? (JSON.parse(raw) as Book[]) : [];
  } catch {
    return [];
  }
};

export const persistSavedBooks = async (books: Book[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(SAVED_BOOKS_KEY, JSON.stringify(books));
  } catch {
    // Storage write failure is non-fatal; silently skip
  }
};

export const loadLastQuery = async (): Promise<string> => {
  try {
    return (await AsyncStorage.getItem(LAST_QUERY_KEY)) ?? '';
  } catch {
    return '';
  }
};

export const persistLastQuery = async (query: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(LAST_QUERY_KEY, query);
  } catch {}
};
