import { Injectable } from '@nestjs/common';
import { S3, Credentials, config } from 'aws-sdk';

// This should only be necessary for local dev work.
if (process.env.NODE_ENV == 'local') {
  const creds = new Credentials(
    process.env.AWS_CRED_KEY,
    process.env.AWS_CRED_SECRET,
  );
  config.credentials = creds;
}

config.update({ region: 'us-east-1' });

@Injectable()
export class AWSS3Helper {
  private readonly s3: S3;

  constructor() {
    this.s3 = new S3();
  }

  public async getProfilePicture(lifterId: string) {
    const params: S3.GetObjectRequest = {
      Bucket: process.env.PROFILE_PICTURE_BUCKET,
      Key: `${lifterId}/${lifterId}.png`,
    };

    try {
      // Check file exists first
      await this.s3.headObject(params).promise();
    } catch (err) {
      throw err;
    }

    try {
      return await this.s3.getSignedUrlPromise('getObject', params);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async uploadProfilePicture(
    lifterId: string,
    file: Express.Multer.File,
  ) {
    try {
      const params: S3.PutObjectRequest = {
        Bucket: process.env.PROFILE_PICTURE_BUCKET,
        Key: `${lifterId}/${lifterId}.png`,
        Body: file.buffer,
      };

      return await this.s3.upload(params).promise();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async deleteProfilePicture(lifterId: string) {
    try {
      const params: S3.DeleteObjectRequest = {
        Bucket: process.env.PROFILE_PICTURE_BUCKET,
        Key: `${lifterId}/${lifterId}.png`,
      };

      return await this.s3.deleteObject(params).promise();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
