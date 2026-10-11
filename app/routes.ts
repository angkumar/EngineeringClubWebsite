import { type RouteConfig } from "@react-router/dev/routes";

export default [
  { index: true, file: "routes/home.tsx" },
  { path: "drone", file: "routes/drone.tsx" },
  { path: "rocket", file: "routes/rocket.tsx" },
  { path: "sponsors", file: "routes/sponsors.tsx" },
  { path: "meetings", file: "routes/meetings.tsx" },
  { path: "admin", file: "routes/admin.tsx" },
  { path: "projects/:projectName", file: "routes/projects.$projectName.tsx" },
  { path: "projects/:projectName/image/:imageName", file: "routes/projects.$projectName.image.$imageName.ts" },
] satisfies RouteConfig;
