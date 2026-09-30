import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
  useLoaderData,
} from "react-router";

import { readdir } from "node:fs/promises";


import { FaInstagram } from "react-icons/fa";
import { SiGroupme } from "react-icons/si";

import type { Route } from "./+types/root";

export async function loader() {
  let projectNames: string[] = [];
  if (typeof window === "undefined") { // Check if running on the server
    try {
      const projectsPath = "./app/routes/projects";
      const projectDirs = await readdir(projectsPath, { withFileTypes: true });
      projectNames = projectDirs
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
    } catch (error) {
      console.error("Failed to read project directories:", error);
      // Fallback to empty array if readdir fails
      projectNames = [];
    }
  }
  return new Response(JSON.stringify({ projectNames }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
interface LoaderData {
  projectNames: string[];
}

import "./app.css";
import "./mdx.css";
import "./markdown.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { projectNames } = useLoaderData<LoaderData>();

  return (
    <div className="flex h-screen">
      <div id="sidebar" className="w-1/5 bg-gray-200 dark:bg-gray-800 p-4">
        <h2 className="text-xl font-bold mb-4">Novi Engineering Club</h2>
        <nav>
          <ul>
            <li className="mb-2"><Link to="/" className="text-blue-600 hover:underline">Home</Link></li>
            {projectNames.map((projectName) => (
              <li key={projectName} className="mb-2">
                <Link to={`/projects/${projectName}`} className="text-blue-600 hover:underline">
                  Project {projectName.charAt(0).toUpperCase() + projectName.slice(1)}
                </Link>
              </li>
            ))}
            <li className="mb-2"><Link to="/meetings" className="text-blue-600 hover:underline">Meetings</Link></li>
            <li className="mb-2"><Link to="/admin" className="text-blue-600 hover:underline font-semibold">Admin Panel</Link></li>
          </ul>
          <div className="flex space-x-4 mt-4">
            <a href="https://www.instagram.com/noviengineeringig/" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-gray-600 dark:text-gray-300 text-2xl hover:text-blue-500" />
            </a>
            <a href="https://groupme.com/join_group/104854219/05ltImUw" target="_blank" rel="noopener noreferrer">
              <SiGroupme className="text-gray-600 dark:text-gray-300 text-2xl hover:text-blue-500" />
            </a>
          </div>
        </nav>
      </div>
      <div id="content" className="flex-grow p-4">
        <Outlet />
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
