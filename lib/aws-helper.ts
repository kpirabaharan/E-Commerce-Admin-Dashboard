import S3 from 'aws-sdk/clients/s3';

const s3 = new S3({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.REGION,
  signatureVersion: 'v4',
});

export const createUploadURL = async (fileName: string, ext: string) => {
  const s3Params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: ext,
  };

  const uploadURL = s3.getSignedUrl('putObject', s3Params);

  return uploadURL;
};
