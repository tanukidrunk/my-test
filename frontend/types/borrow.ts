export type Borrowed = {
  id: number;
  memberId: number;
  bookId: number;
  loanDate: string;
  returnDate?: string | null;
  status: 'BORROWED' | 'RETURNED';
};

export type BorrowStats = {
  total: number;
  active: number;
  returned: number;
  activeRate: number;
  returnRate: number;
};