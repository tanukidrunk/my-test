import { minioClient, BUCKET_NAME } from "./minio";

export async function initMinio() {
  const exists = await minioClient.bucketExists(BUCKET_NAME);

  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME, "us-east-1");
    console.log("Bucket created:", BUCKET_NAME);
  }
}