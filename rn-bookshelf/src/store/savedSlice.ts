import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistSavedBooks } from '../utils/storage';
import { Book, SavedState } from '../types';

const initialState: SavedState = {
  books: [],
};

const savedSlice = createSlice({
  name: 'saved',
  initialState,
  reducers: {
    hydrateSaved(state, action: PayloadAction<Book[]>) {
      state.books = action.payload;
    },
    toggleSaved(state, action: PayloadAction<Book>) {
      const book = action.payload;
      const idx = state.books.findIndex(b => b.key === book.key);
      if (idx === -1) {
        state.books.push(book);
      } else {
        state.books.splice(idx, 1);
      }
      persistSavedBooks(state.books);
    },
  },
});

export const { hydrateSaved, toggleSaved } = savedSlice.actions;
export default savedSlice.reducer;
