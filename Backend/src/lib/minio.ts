import * as Minio from 'minio';

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: Number(process.env.MINIO_PORT) || 7001,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'miniopassword',
});

export const BUCKET_NAME = 'book-images';

// สร้าง bucket ถ้ายังไม่มี (เรียกตอน startup)
export async function initBucket() {
  const exists = await minioClient.bucketExists(BUCKET_NAME);
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');

    // ตั้งเป็น PRIVATE (ไม่ set policy = private โดย default)
    console.log(`Bucket "${BUCKET_NAME}" created as PRIVATE`);
  }
}