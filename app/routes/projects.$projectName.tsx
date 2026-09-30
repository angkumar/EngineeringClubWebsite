import type { MetaFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import React from "react";
import fs from "node:fs/promises";
import path from "node:path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export async function loader({ params }: LoaderFunctionArgs) {
  const projectName = params.projectName;

  if (!projectName) {
    throw new Response("Not Found", { status: 404 });
  }

  const projectDirPath = path.join(process.cwd(), `app/routes/projects/${projectName}`);
  try {
    await fs.access(projectDirPath);
  } catch (error) {
    throw new Response("Not Found", { status: 404 });
  }

  const markdownFilePath = path.join(projectDirPath, `${projectName}.md`);
  let markdownContent = "";
  try {
    markdownContent = await fs.readFile(markdownFilePath, "utf-8");
  } catch (error) {
    throw new Response("Not Found", { status: 404 });
  }

  return {
    projectName,
    title: `Project ${projectName.toUpperCase()}`,
    markdownContent,
  };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.title || "Project Not Found" }];
};

export default function ProjectPage() {
  const { projectName, markdownContent } = useLoaderData<typeof loader>();

  const components = {
    img: (props: any) => {
      const src = props.src.startsWith('./')
        ? `/projects/${projectName}/image/${props.src.substring(2)}`
        : props.src;
      return <img {...props} src={src} className="w-full h-auto" />;
    },
  };

  return (
    <div className="p-8 markdown">
      <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
}
