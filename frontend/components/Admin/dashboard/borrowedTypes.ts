export type Borrowed = {
  id: number;
  memberId: number;
  bookId: number;
    book: {
    title: string;
  };
  loanDate: string;
  returnDate?: string | null;
  status: 'BORROWED' | 'RETURNED';
};

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('th-TH', {
    timeZone: 'Asia/Bangkok',day: '2-digit', month: 'short', year: 'numeric',hour: '2-digit',
  });
}  