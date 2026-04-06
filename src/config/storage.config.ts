export default () => ({
  storage: {
    type: process.env.STORAGE_TYPE || 'local', // 'local' | 's3'
    local: {
      destination: process.env.UPLOAD_PATH || './uploads',
    },
    s3: {
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucket: process.env.AWS_S3_BUCKET,
    },
  },
});