import { Client } from 'minio';


const minioClient = new Client({
  endPoint: 'minio.mausvil.dev',
  port: 443,  // Cambia si usas otro puerto
  useSSL: true, // Si estás usando SSL, configúralo en true
  accessKey: process.env.MINIO_ACCES_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

export const uploadFile = async (bucketName: string, id: string, file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  await minioClient.putObject(bucketName, `${id}.${file.type.split('/')[1]}`, Buffer.from(buffer), file.size);
  const fileUrl = `https://minio.mausvil.dev/${bucketName}/${id}.${file.type.split('/')[1]}`;

  return fileUrl;
};