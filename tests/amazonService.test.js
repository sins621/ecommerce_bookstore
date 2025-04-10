import { describe, it, expect, vi, beforeEach } from "vitest";
import { PutObjectCommand } from "@aws-sdk/client-s3";

vi.mock("@aws-sdk/client-s3", async () => {
  const actual = await vi.importActual("@aws-sdk/client-s3");
  return {
    ...actual,
    S3Client: vi.fn().mockImplementation(() => ({
      send: vi
        .fn()
        .mockResolvedValue({ $metadata: { requestId: "some real id" } }),
    })),
    PutObjectCommand: vi.fn(),
  };
});

describe("amazonService", () => {
  let amazonService;
  let mockSend;

  beforeEach(async () => {
    amazonService = (await import("../services/amazonService.js")).default;

    mockSend = amazonService.s3.send;
    mockSend.mockClear();
  });

  it("should call S3 send with correct parameters when uploading an image", async () => {
    const fakeBuffer = Buffer.from("fake image data");
    const mockInfo = {
      bucket: "test-bucket",
      name: "image.jpg",
      buffer: fakeBuffer,
    };

    const result = await amazonService.uploadImage(mockInfo);

    expect(PutObjectCommand).toHaveBeenCalledWith({
      Bucket: mockInfo.bucket,
      Key: mockInfo.name,
      Body: fakeBuffer,
      ContentType: "image/jpeg",
    });

    expect(result).toBeTruthy;
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith(expect.any(PutObjectCommand));
  });

});
