const multer = require('multer');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client } = require('../config/aws-config');
const mm = require('music-metadata');

const storage = multer.memoryStorage();

const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'song' && !file.mimetype.startsWith('audio/')) {
      return cb(new Error('Only audio files are allowed for songs'));
    }
    if (file.fieldname === 'cover' && !file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed for covers'));
    }
    cb(null, true);
  }
}).fields([
  { name: 'song', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]);

const extractAudioMetadata = async (buffer) => {
  try {
    const metadata = await mm.parseBuffer(buffer);
    return {
      duration: metadata.format.duration || 0,
      bitrate: metadata.format.bitrate,
      sampleRate: metadata.format.sampleRate
    };
  } catch (error) {
    console.error('Error extracting metadata:', error);
    return { duration: 0 };
  }
};

const uploadToS3 = async (file, folder) => {
  if (!file) return null;

  const key = `${folder}/${Date.now()}-${file.originalname}`;
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('Failed to upload file to S3');
  }
};

module.exports = { 
  upload: uploadMiddleware,
  uploadToS3,
  extractAudioMetadata
};