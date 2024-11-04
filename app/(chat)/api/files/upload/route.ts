import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { getAuth } from '@clerk/nextjs/server';

const tempDirectory = path.join(process.cwd(), "temp");

const FileSchema = z.object({
  file: z.object({
    size: z.number().positive().max(5 * 1024 * 1024, "File size should be less than 5MB"),
    type: z.enum(["image/jpeg", "image/png", "application/pdf", "text/csv"], {
      errorMap: () => ({ message: "File type should be JPEG, PNG, or PDF" }),
    }),
  }),
});

// Ensure the temp directory exists
if (!fs.existsSync(tempDirectory)) {
  fs.mkdirSync(tempDirectory);
}

// Function to delete expired files
const cleanUpExpiredFiles = (userId: string) => {
  const userDir = path.join(tempDirectory, userId);
  if (!fs.existsSync(userDir)) return; // No user directory to clean

  const files = fs.readdirSync(userDir);
  const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;

  files.forEach((file) => {
    const filePath = path.join(userDir, file);
    const stats = fs.statSync(filePath);

    if (stats.mtimeMs < thirtyMinutesAgo) {
      fs.unlinkSync(filePath);
    }
  });
};

export async function POST(req: NextRequest) {
  if (!req.body) {
    return new Response("Request body is empty", { status: 400 });
  }

  const { userId } = getAuth(req);
  console.log(userId);

  cleanUpExpiredFiles(userId!); // Clean up expired files for the user

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate the file properties
    const validatedFile = FileSchema.safeParse({
      file: { size: file.size, type: file.type },
    });

    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.errors
          .map((error) => error.message)
          .join(", ");

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Create user-specific directory if it doesn't exist
    const userDir = path.join(tempDirectory, userId!);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    const filename = file.name;
    const fileBuffer = await file.arrayBuffer();
    const filePath = path.join(userDir, filename);

    // Write the file to the user-specific directory
    fs.writeFileSync(filePath, Buffer.from(fileBuffer));

    const url = `/temp/${userId}/${filename}`; // Construct the URL
    const pathname = filename; // Path on the server
    const contentType = file.type; // Content type of the uploaded file

// Determine the type of file (image or file)
    const type = contentType.startsWith('image/') ? 'image' : 'file';

    return NextResponse.json(
        {
          message: "File uploaded successfully",
          url,
          pathname,
          contentType,
          type
        },
        { status: 200 }
    );

  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json(
        { error: "Failed to process request" },
        { status: 500 }
    );
  }
}
