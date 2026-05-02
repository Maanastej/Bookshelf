import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { searchBooks } from '../api/booksApi';
import { persistLastQuery } from '../utils/storage';
import { BooksState, Book } from '../types';

const PAGE_SIZE = 20;

const initialState: BooksState = {
  items: [],
  query: '',
  page: 1,
  totalFound: 0,
  loading: false,
  loadingMore: false,
  error: null,
  hasMore: false,
};

export const fetchBooks = createAsyncThunk(
  'books/fetch',
  async ({ query, page }: { query: string; page: number }, { rejectWithValue }) => {
    try {
      const data = await searchBooks(query, page);
      return { docs: data.docs, numFound: data.numFound, page };
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    resetSearch(state) {
      state.items = [];
      state.page = 1;
      state.totalFound = 0;
      state.error = null;
      state.hasMore = false;
    },
    restoreQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBooks.pending, (state, action) => {
        if (action.meta.arg.page === 1) {
          state.loading = true;
          state.loadingMore = false;
          state.error = null;
        } else {
          state.loadingMore = true;
        }
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        const { docs, numFound, page } = action.payload;
        state.loading = false;
        state.loadingMore = false;
        state.totalFound = numFound;
        state.page = page;

        if (page === 1) {
          state.items = docs;
        } else {
          // Deduplicate by key before appending
          const existingKeys = new Set(state.items.map((b: Book) => b.key));
          const newDocs = docs.filter((b: Book) => !existingKeys.has(b.key));
          state.items = [...state.items, ...newDocs];
        }

        state.hasMore = state.items.length < numFound && docs.length === PAGE_SIZE;

        // Persist last query after a successful fetch
        if (page === 1) {
          persistLastQuery(state.query);
        }
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = (action.payload as string) ?? 'Unknown error';
      });
  },
});

export const { setQuery, resetSearch, restoreQuery } = booksSlice.actions;
export default booksSlice.reducer;
