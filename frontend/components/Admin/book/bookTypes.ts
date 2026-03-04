export type Book = {
  id: number;
  title: string;
  author: string;
  publication_year: string;
  categoryId: number;
  imageUrl?: string | null;
};

export type Category = {
  id: number;
  name: string;
};

export const EMPTY_BOOK: Book = {
  id: 0, title: '', author: '', publication_year: '', categoryId: 0,
};