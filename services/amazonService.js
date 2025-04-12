import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import "dotenv/config";

const bucketRegion = process.env.AWS_BUCKET_REGION;
const key = process.env.AWS_BUCKET_KEY;
const secret = process.env.AWS_BUCKET_SECRET;

const amazonService = {
  s3: new S3Client({
    credentials: {
      accessKeyId: key,
      secretAccessKey: secret,
    },
    region: bucketRegion,
  }),

  uploadImage: async (info) => {
    const params = {
      Bucket: info.bucket,
      Key: info.name,
      Body: info.buffer,
      ContentType: "image/jpeg",
    };

    const command = new PutObjectCommand(params);

    try {
      const result = await amazonService.s3.send(command);
      return result.$metadata.requestId;
    } catch (err) {
      console.error(`Error uploading image to AWS S3 error: ${err}`);
      return "";
    }
  },

  getImageUrl: async (info) => {
    const GetObjectParams = {
      Bucket: info.bucket,
      Key: info.name,
    };
    const command = new GetObjectCommand(GetObjectParams);
    const url = await getSignedUrl(amazonService.s3, command, {
      expiresIn: 3600,
    });
    console.log(url);
    return url;
  },
};

export default amazonService;
