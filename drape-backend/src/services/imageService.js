const AWS = require('aws-sdk');
const cloudinary = require('cloudinary').v2;
const logger = require('../config/logger');
const { v4: uuidv4 } = require('crypto');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadImage = async (fileBuffer, folder, filename) => {
  try {
    const key = `${folder}/${uuidv4()}-${filename}`;

    const s3Params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: fileBuffer,
      ContentType: 'image/jpeg',
      ACL: 'public-read',
    };

    const s3Result = await s3.upload(s3Params).promise();
    const s3Url = s3Result.Location;

    const cloudinaryResult = await cloudinary.uploader.upload(s3Url, {
      folder: `drape/${folder}`,
      transformation: [
        { width: 1200, height: 1200, crop: 'limit', quality: 'auto' },
      ],
    });

    return {
      originalUrl: s3Url,
      optimizedUrl: cloudinaryResult.secure_url,
      thumbnailUrl: cloudinary.url(cloudinaryResult.public_id, {
        width: 200,
        height: 200,
        crop: 'fill',
        quality: 'auto',
      }),
      mediumUrl: cloudinary.url(cloudinaryResult.public_id, {
        width: 600,
        height: 600,
        crop: 'limit',
        quality: 'auto',
      }),
      largeUrl: cloudinary.url(cloudinaryResult.public_id, {
        width: 1200,
        height: 1200,
        crop: 'limit',
        quality: 'auto',
      }),
    };
  } catch (error) {
    logger.error(`Image upload failed: ${error.message}`);
    throw new Error('Image upload failed');
  }
};

exports.uploadBase64Image = async (base64Data, folder, filename) => {
  try {
    const buffer = Buffer.from(base64Data, 'base64');
    return await this.uploadImage(buffer, folder, filename);
  } catch (error) {
    logger.error(`Base64 image upload failed: ${error.message}`);
    throw new Error('Base64 image upload failed');
  }
};
