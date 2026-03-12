'use client';
import { Badge }   from '@/components/ui/badge';
import { Button }  from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Clock, CheckCircle2, Tag } from 'lucide-react';
import { Book } from '@/components/Member/book/BookRow';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react'; 
import { fetchWithAuth } from '@/app/lib/fetchWithAuth';
interface BookCardProps {
  book: Book;
  onBorrow: (book: Book) => void;
}

// Palette per category (fallback to slate)
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; spine: string }> = {
  fiction:     { bg: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200', spine: 'bg-gradient-to-b from-violet-500 to-violet-700'  },
  science:     { bg: 'bg-cyan-50',    text: 'text-cyan-700',    border: 'border-cyan-200',   spine: 'bg-gradient-to-b from-cyan-500 to-cyan-700'       },
  history:     { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',  spine: 'bg-gradient-to-b from-amber-500 to-amber-700'     },
  technology:  { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200',spine: 'bg-gradient-to-b from-emerald-500 to-emerald-700' },
  business:    { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',   spine: 'bg-gradient-to-b from-blue-500 to-blue-700'       },
  default:     { bg: 'bg-slate-50',   text: 'text-slate-700',   border: 'border-slate-200',  spine: 'bg-gradient-to-b from-slate-400 to-slate-600'     },
};

function getCategoryColor(categoryName?: string) {
  if (!categoryName) return CATEGORY_COLORS.default;
  const key = categoryName.toLowerCase();
  return CATEGORY_COLORS[key] ?? CATEGORY_COLORS.default;
}

// Random pastel cover gradient (deterministic from title)
function getCoverGradient(title: string) {
  const gradients = [
    'from-rose-400 via-pink-300 to-purple-400',
    'from-amber-400 via-orange-300 to-rose-400',
    'from-emerald-400 via-teal-300 to-cyan-400',
    'from-blue-400 via-indigo-300 to-violet-400',
    'from-yellow-400 via-amber-300 to-orange-400',
    'from-sky-400 via-blue-300 to-indigo-400',
    'from-fuchsia-400 via-pink-300 to-rose-400',
    'from-teal-400 via-emerald-300 to-green-400',
  ];
  let hash = 0;
  for (const c of title) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
  return gradients[hash % gradients.length];
}

export default function BookCard({ book, onBorrow }: BookCardProps) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const isAvailable = book.status === 'AVAILABLE';
  const colors      = getCategoryColor(book.category?.name);
  const cover       = getCoverGradient(book.title);
  
  useEffect(() => {
    if (book.imageUrl) {
     fetchWithAuth(`/book/${book.id}/image-url`)
        .then((json) => setImgUrl(json.data?.url ?? null))
        .catch(() => setImgUrl(null));
    }
  }, [book.id, book.imageUrl]);

  return (
    <Card
  className={cn(
    "group relative flex flex-col overflow-hidden border shadow-sm",
    "transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
    colors.border,
    colors.bg
  )}
>
  {/* ── BOOK COVER ── */}
  <div className="relative h-52 overflow-hidden">

    {/* Spine */}
    <div className={cn("absolute left-0 top-0 bottom-0 w-3 z-10", colors.spine)} />

    {/* ✅ Image */}
    {imgUrl ? (
      <>
        <img
          src={imgUrl}
          alt={book.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* overlay เพื่อให้ badge อ่านง่าย */}
        <div className="absolute inset-0 bg-black/10" />
      </>
    ) : (
      <>
        {/* Gradient fallback */}
        <div className={cn("absolute inset-0 bg-gradient-to-br", cover)} />

        {/* Texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2Zy...')] opacity-40" />

        {/* Title */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 pl-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center shadow-inner border border-white/30">
            <BookOpen className="w-8 h-8 text-white/90 mx-auto mb-1" />
            <p className="text-white font-bold text-sm leading-tight line-clamp-2 drop-shadow">
              {book.title}
            </p>
          </div>
        </div>
      </>
    )}

    {/* ── STATUS BADGE ── */}
    <div className="absolute top-3 right-3 z-20">
      {isAvailable ? (
        <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
          <CheckCircle2 size={10} />
          Available
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 bg-slate-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
          <Clock size={10} />
          Borrowed
        </span>
      )}
    </div>

  </div>

  {/* ── CARD BODY ── */}
  <CardContent className="flex flex-col flex-1 p-4 gap-3">

    {/* Title */}
    <div className="flex-1">
      <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mb-1">
        {book.title}
      </h3>
      <p className="text-xs text-slate-500 font-medium line-clamp-1">
        {book.author}
      </p>
    </div>

    {/* Category */}
    {book.category?.name && (
      <Badge
        variant="secondary"
        className={cn(
          "self-start text-[10px] font-semibold px-2 py-0.5 gap-1",
          colors.bg,
          colors.text,
          colors.border,
          "border"
        )}
      >
        <Tag size={9} />
        {book.category.name}
      </Badge>
    )}

    {/* Action */}
    <Button
      size="sm"
      disabled={!isAvailable}
      onClick={() => isAvailable && onBorrow(book)}
      className={cn(
        "w-full text-xs font-bold tracking-wide transition-all duration-200",
        isAvailable
          ? "bg-slate-900 hover:bg-slate-700 text-white shadow-sm hover:shadow-md active:scale-[0.98]"
          : "bg-slate-100 text-slate-400 cursor-not-allowed"
      )}
    >
      {isAvailable ? (
        <>
          <BookOpen size={13} className="mr-1.5" />
          Borrow This Book
        </>
      ) : (
        "Currently Unavailable"
      )}
    </Button>

  </CardContent>
</Card>
  );
} 