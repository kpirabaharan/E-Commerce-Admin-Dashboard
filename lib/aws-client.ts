import S3 from 'aws-sdk/clients/s3';

const s3 = new S3({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.AWS_PUBLIC_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.REGION,
  signatureVersion: 'v4',
});

export default s3;
