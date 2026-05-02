export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  number_of_pages_median?: number;
  subject?: string[];
  publisher?: string[];
  language?: string[];
  isbn?: string[];
  edition_count?: number;
}

export interface BooksApiResponse {
  numFound: number;
  start: number;
  docs: Book[];
}

export interface BooksState {
  items: Book[];
  query: string;
  page: number;
  totalFound: number;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
}

export interface SavedState {
  books: Book[];
}
