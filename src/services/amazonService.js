import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
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
};

async function test() {
  const imageUrl =
    "https://ia800505.us.archive.org/view_archive.php?archive=/2/items/olcovers147/olcovers147-L.zip&file=1474730-L.jpg";
  const response = await fetch(imageUrl);

  if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  amazonService.uploadImage({
    bucket: "process.env.AWS_BUCKET_NAME",
    name: "Test2",
    buffer: buffer,
  });
}

test();

export default amazonService;
