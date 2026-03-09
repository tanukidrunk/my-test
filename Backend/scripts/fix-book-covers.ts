import { prisma } from "../src/prisma";



function generateCoverUrl(title: string) {
  const encoded = encodeURIComponent(title);
  return `https://covers.openlibrary.org/b/title/${encoded}-L.jpg`;
}

async function main() {

  // หา book ที่ยังไม่มีรูป
  const books = await prisma.book.findMany({
    where: {
      imageUrl: null,
    },
  });

  console.log(`Found ${books.length} books without image`);

  for (const book of books) {

    const imageUrl = generateCoverUrl(book.title);

    await prisma.book.update({
      where: { id: book.id },
      data: { imageUrl },
    });

    console.log(`Updated: ${book.title}`);
  }

  console.log("All books updated");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });