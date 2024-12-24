import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiOptions } from "cloudinary";
import sharp from "sharp";

cloudinary.config({
  cloud_name: "dogc09dyt",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const compressAndUploadScreenshot = async (
  screenshot: string
): Promise<any> => {
  // Remove the data URL prefix
  const base64Data = screenshot.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  // Compress the image using sharp
  const compressedBuffer = await sharp(buffer)
    .jpeg({ quality: 80 }) // Adjust quality as needed
    .toBuffer();

  return new Promise((resolve, reject) => {
    const uploadOptions: UploadApiOptions = {
      folder: "print3r",
      resource_type: "image",
    };

    cloudinary.uploader
      .upload_stream(uploadOptions, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(compressedBuffer);
  });
};

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      console.warn("Upload attempt with no image data");
      return NextResponse.json(
        { error: "No image data provided" },
        { status: 400 }
      );
    }

    const imageInfo = await compressAndUploadScreenshot(image);

    return NextResponse.json({
      image: imageInfo.url,
      version: imageInfo.version,
      id: imageInfo.public_id.split("/")[1],
    });
  } catch (error) {
    console.error("Error in image upload:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
