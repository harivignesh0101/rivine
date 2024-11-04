// app/api/s3/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getAuth } from '@clerk/nextjs/server';

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME!;

export async function POST(req: NextRequest) {
    try {
        const { userId } = getAuth(req)
        console.log(userId);
        const formData = await req.formData();
        const file: any = formData.get('file') as Blob;

        if (!file) {
            return NextResponse.json({ error: 'File not provided' }, { status: 400 });
        }

        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${Date.now()}-${file.name}`;

        const uploadParams = {
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: fileBuffer,
            ContentType: file.type,
        };

        await s3.send(new PutObjectCommand(uploadParams));

        return NextResponse.json({ message: 'File uploaded successfully', fileName });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const listParams = {
            Bucket: BUCKET_NAME,
        };

        const data = await s3.send(new ListObjectsV2Command(listParams));

        const files = data.Contents?.map((file) => ({
            key: file.Key,
            lastModified: file.LastModified,
            size: file.Size,
        }));

        return NextResponse.json({ files });
    } catch (error) {
        console.error('List error:', error);
        return NextResponse.json({ error: 'Failed to retrieve files' }, { status: 500 });
    }
}
