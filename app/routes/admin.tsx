import { useState, useRef, useEffect } from "react";
import { Form, useLoaderData, useNavigation } from "react-router";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import MarkdownEditor from "../components/MarkdownEditor";
import fs from "node:fs/promises";
import path from "node:path";

interface Project {
  name: string;
  content: string;
}

interface LoaderData {
  projects: Project[];
}

export async function loader({ request }: LoaderFunctionArgs) {
  // Check if admin is accessed (in a real app, you'd check authentication here)
  // For now, we'll allow access but you should add proper authentication
  
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
    return { projects: [] };
  }
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
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

    if (_action === "delete") {
      // Delete project
      try {
        await fs.rm(projectDirPath, { recursive: true, force: true });
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
        message: `Project ${projectName} saved successfully`,
        projectName,
      };
    } catch (error) {
      return { error: `Failed to write markdown file: ${error}` };
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return { error: "Failed to process request" };
  }
}

export default function AdminPanel() {
  const { projects } = useLoaderData<LoaderData>();
  const navigation = useNavigation();
  const isInitialized = useRef(false);
  
  // Get initial selected project from sessionStorage or default to first project
  const getInitialProject = () => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('selectedProject');
      if (stored && projects.find(p => p.name === stored)) {
        return stored;
      }
    }
    return projects.length > 0 ? projects[0].name : null;
  };

  const [selectedProject, setSelectedProject] = useState<string | null>(getInitialProject);
  const [newProjectName, setNewProjectName] = useState("");
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Save selected project to sessionStorage whenever it changes
  useEffect(() => {
    if (selectedProject && typeof window !== 'undefined') {
      sessionStorage.setItem('selectedProject', selectedProject);
    }
  }, [selectedProject]);

  // Initialize selectedProject only once when projects first load
  useEffect(() => {
    if (projects.length > 0 && !isInitialized.current && !selectedProject) {
      setSelectedProject(projects[0].name);
      isInitialized.current = true;
    }
  }, [projects, selectedProject]);

  const currentProject = projects.find((p) => p.name === selectedProject);
  const isSaving = navigation.state === "submitting";

  // Show notification on successful save
  useEffect(() => {
    if (navigation.state === "idle") {
      setNotification({
        message: "Project saved successfully!",
        type: "success",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  }, [navigation.state]);

  const handleSaveProject = (content: string) => {
    if (!selectedProject) return;
    // Form will be submitted by the editor's save button
    const form = document.getElementById(
      `project-form-${selectedProject}`
    ) as HTMLFormElement;
    if (form) {
      const contentInput = form.querySelector(
        'textarea[name="content"]'
      ) as HTMLTextAreaElement;
      if (contentInput) {
        contentInput.value = content;
      }
      form.submit();
    }
  };

  return (
    <div className="admin-panel flex">
      {/* Sidebar */}
      <div className="admin-sidebar overflow-y-auto">
        <div className="admin-sidebar-inner">
          <h1 className="admin-title">
            Admin Panel
          </h1>

          {/* Projects List */}
          <div className="mb-8">
            <h2 className="admin-section-label">
              Projects
            </h2>
            <div className="space-y-2">
              {projects.map((project) => (
                <button
                  key={project.name}
                  onClick={() => {
                    setSelectedProject(project.name);
                    setShowNewProjectForm(false);
                  }}
                  className={`admin-project-button ${selectedProject === project.name ? "is-selected" : ""}`}
                >
                  {project.name}
                </button>
              ))}
            </div>
          </div>

          {/* New Project Button */}
          <button
            onClick={() => setShowNewProjectForm(true)}
            className="admin-new-project"
          >
            + New Project
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="admin-header">
          <h2 className="admin-page-heading">
            {showNewProjectForm ? "Create New Project" : `Edit: ${selectedProject || "Select a project"}`}
          </h2>
          {notification && (
            <div
              className={`admin-notification ${
                notification.type === "success"
                  ? "is-success"
                  : "is-error"
              }`}
            >
              {notification.message}
            </div>
          )}
        </div>

        {/* Editor Content */}
        <div className="admin-body flex-1 overflow-hidden">
          {showNewProjectForm ? (
            // New Project Form
            <Form
              method="post"
              id="new-project-form"
              className="admin-form flex flex-col gap-4 h-full"
            >
              <div>
                <label className="admin-label">
                  Project Name
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g., my-awesome-project"
                  className="admin-input"
                />
                <p className="admin-hint">
                  This will be used as the folder and markdown filename
                </p>
              </div>

              <input type="hidden" name="content" value="# New Project\n\nAdd your content here..." />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewProjectForm(false);
                    setNewProjectName("");
                  }}
                  className="admin-button admin-button-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !newProjectName.trim()}
                  className="admin-button admin-button-primary"
                >
                  {isSaving ? "Creating..." : "Create Project"}
                </button>
              </div>
            </Form>
          ) : currentProject ? (
            // Edit Project Form
            <Form
              method="post"
              key={selectedProject}
              id={`project-form-${selectedProject}`}
              className="admin-form flex flex-col gap-4 h-full"
            >
              <input type="hidden" name="projectName" value={selectedProject || ""} />
              <textarea
                name="content"
                defaultValue={currentProject.content}
                className="hidden"
              />

              <div className="flex-1 overflow-hidden">
                <MarkdownEditor
                  initialContent={currentProject.content}
                  onSave={handleSaveProject}
                  isSaving={isSaving}
                />
              </div>

              {/* Delete Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (
                      confirm(
                        `Are you sure you want to delete the project "${selectedProject}"? This action cannot be undone.`
                      )
                    ) {
                      const deleteForm = document.createElement("form");
                      deleteForm.method = "POST";
                      deleteForm.innerHTML = `
                        <input type="hidden" name="projectName" value="${selectedProject}" />
                        <input type="hidden" name="_action" value="delete" />
                        <input type="hidden" name="content" value="" />
                      `;
                      document.body.appendChild(deleteForm);
                      deleteForm.submit();
                      document.body.removeChild(deleteForm);
                    }
                  }}
                  className="admin-button admin-button-danger"
                >
                  Delete Project
                </button>
              </div>
            </Form>
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <p className="admin-empty-title">
                  No project selected
                </p>
                <p className="admin-empty-copy">
                  Select a project from the sidebar or create a new one
                </p>
                <button
                  onClick={() => setShowNewProjectForm(true)}
                  className="admin-button admin-button-primary"
                >
                  Create Your First Project
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
