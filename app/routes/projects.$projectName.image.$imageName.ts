import type { LoaderFunctionArgs } from "react-router";
import fs from "node:fs/promises";
import path from "node:path";

export async function loader({ params }: LoaderFunctionArgs) {
  const projectName = params.projectName;
  const imageName = params.imageName;

  if (!projectName || !imageName) {
    throw new Response("Not Found", { status: 404 });
  }

  const imagePath = path.join(
    process.cwd(),
    `app/routes/projects/${projectName}/${imageName}`
  );

  try {
    const imageBuffer = await fs.readFile(imagePath);
    const contentType = getImageContentType(imageName);

    return new Response(imageBuffer, {
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error(`Error serving image ${imageName} for project ${projectName}:`, error);
    throw new Response("Not Found", { status: 404 });
  }
}

function getImageContentType(imageName: string): string {
  const ext = path.extname(imageName).toLowerCase();
  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}