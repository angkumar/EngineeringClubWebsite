import { type LoaderFunctionArgs, type ActionFunctionArgs } from "react-router";
import fs from "node:fs/promises";
import path from "node:path";

// GET: List all projects
export async function loader({ request }: LoaderFunctionArgs) {
  if (request.method !== "GET") {
    return { error: "Method not allowed" };
  }

  try {
    const projectsPath = path.join(process.cwd(), "app/routes/projects");
    const projectDirs = await fs.readdir(projectsPath, { withFileTypes: true });
    
    const projects = await Promise.all(
      projectDirs
        .filter((dirent) => dirent.isDirectory())
        .map(async (dirent) => {
          const mdPath = path.join(projectsPath, dirent.name, `${dirent.name}.md`);
          try {
            const content = await fs.readFile(mdPath, "utf-8");
            return {
              name: dirent.name,
              content,
            };
          } catch {
            return {
              name: dirent.name,
              content: "",
            };
          }
        })
    );

    return { projects };
  } catch (error) {
    console.error("Error reading projects:", error);
    return { error: "Failed to read projects" };
  }
}

// POST/PUT: Create or update a project
export async function action({ request }: ActionFunctionArgs) {
  if (request.method === "OPTIONS") {
    return {};
  }

  if (!["POST", "PUT", "DELETE"].includes(request.method)) {
    return { error: "Method not allowed" };
  }

  try {
    const formData = await request.formData();
    const projectName = formData.get("projectName") as string;
    const content = formData.get("content") as string;
    const _action = formData.get("_action") as string;

    if (!projectName) {
      return { error: "Project name is required" };
    }

    const projectsPath = path.join(process.cwd(), "app/routes/projects");
    const projectDirPath = path.join(projectsPath, projectName);
    const mdFilePath = path.join(projectDirPath, `${projectName}.md`);

    if (_action === "DELETE") {
      // Delete project
      try {
        await fs.rm(projectDirPath, { recursive: true });
        return { success: true, message: `Project ${projectName} deleted` };
      } catch (error) {
        return { error: `Failed to delete project: ${error}` };
      }
    }

    // Create or update project
    if (!content) {
      return { error: "Content is required" };
    }

    // Create project directory if it doesn't exist
    try {
      await fs.mkdir(projectDirPath, { recursive: true });
    } catch (error) {
      return { error: `Failed to create project directory: ${error}` };
    }

    // Write markdown file
    try {
      await fs.writeFile(mdFilePath, content, "utf-8");
      return { 
        success: true, 
        message: `Project ${projectName} ${request.method === "POST" ? "created" : "updated"}`,
        projectName 
      };
    } catch (error) {
      return { error: `Failed to write markdown file: ${error}` };
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return { error: "Failed to process request" };
  }
}
