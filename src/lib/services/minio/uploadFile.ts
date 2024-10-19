import { Client } from 'minio';
import { Readable } from 'stream';

const minioClient = new Client({
  endPoint: 'minio.mausvil.dev',
  port: 443,  // Cambia si usas otro puerto
  useSSL: true, // Si estás usando SSL, configúralo en true
  accessKey: process.env.MINIO_ACCES_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

function toNodeReadable(stream: ReadableStream) {
  const reader = stream.getReader();
  return new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) {
        this.push(null);
      } else {
        this.push(Buffer.from(value));
      }
    }
  });
}

export const uploadFile = async (bucketName: string, id: string, file: Blob): Promise<string> => {
  const nodeStream = toNodeReadable(file.stream());

  const contentType = file.type || 'application/octet-stream';
  const extension = contentType.split('/')[1];

  await minioClient.putObject(bucketName, `${id}.${extension}`, nodeStream, file.size, { 'Content-Type': contentType });

  const fileUrl = `https://minio.mausvil.dev/${bucketName}/${id}.${extension}`;

  return fileUrl;
};