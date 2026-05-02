import { BooksApiResponse } from '../types';

const BASE_URL = 'https://openlibrary.org';
const PAGE_SIZE = 20;

export const searchBooks = async (
  query: string,
  page: number,
): Promise<BooksApiResponse> => {
  const offset = (page - 1) * PAGE_SIZE;
  const url = `${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=${PAGE_SIZE}&offset=${offset}&fields=key,title,author_name,first_publish_year,cover_i,number_of_pages_median,subject,publisher,language,isbn,edition_count`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  const data: BooksApiResponse = await response.json();
  return data;
};

export const getCoverUrl = (coverId: number, size: 'S' | 'M' | 'L' = 'M'): string =>
  `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
