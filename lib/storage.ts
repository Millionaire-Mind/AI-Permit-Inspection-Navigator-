import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getS3Client() {
  const region = process.env.AWS_REGION || "us-east-1";
  const endpoint = process.env.AWS_ENDPOINT || undefined; // for R2
  const forcePathStyle = process.env.AWS_S3_FORCE_PATH_STYLE === "true" || !!endpoint;
  const credentials = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY }
    : undefined;
  return new S3Client({ region, endpoint, forcePathStyle, credentials });
}

export async function uploadBuffer({ key, contentType, body }: { key: string; contentType: string; body: Buffer }) {
  const bucket = process.env.AWS_S3_BUCKET;
  if (!bucket) throw new Error("Missing AWS_S3_BUCKET");
  const s3 = getS3Client();
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType }));
  return { bucket, key };
}

export async function getSignedFileUrl({ key, expiresIn = 60 * 15 }: { key: string; expiresIn?: number }) {
  const bucket = process.env.AWS_S3_BUCKET;
  if (!bucket) throw new Error("Missing AWS_S3_BUCKET");
  const s3 = getS3Client();
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const url = await getSignedUrl(s3, command, { expiresIn });
  return url;
}

