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
    <div className="site-shell">
      <header className="site-header">
        <Link to="/" className="brand" aria-label="Novi Engineering Club home">
          <span className="brand-mark">NE</span>
          <span className="brand-copy"><strong>Novi Engineering Club</strong><small>Make things. Make them fly.</small></span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link to="/#projects">Our builds</Link>
          {projectNames.slice(0, 2).map((projectName) => (
            <Link key={projectName} to={`/projects/${encodeURIComponent(projectName)}`}>
              {projectName.charAt(0).toUpperCase() + projectName.slice(1)}
            </Link>
          ))}
          <Link to="/meetings">Meetings</Link>
          <Link to="/meetings" className="nav-cta">Join the club <span aria-hidden="true">↗</span></Link>
        </nav>
      </header>
      <div id="content"><Outlet /></div>
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} NOVI ENGINEERING CLUB · NOVI, MICHIGAN</span>
        <span className="footer-social">
          <a href="https://www.instagram.com/noviengineeringig/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram size={16} /></a>
          <a href="https://groupme.com/join_group/104854219/05ltImUw" target="_blank" rel="noopener noreferrer" aria-label="GroupMe"><SiGroupme size={15} /></a>
          <Link to="/admin">Admin</Link>
        </span>
      </footer>
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
