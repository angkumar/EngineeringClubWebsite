import { type RouteConfig } from "@react-router/dev/routes";

export default [
  { index: true, file: "routes/home.tsx" },
  { path: "meetings", file: "routes/meetings.tsx" },
  { path: "admin", file: "routes/admin.tsx" },
  { path: "projects/:projectName", file: "routes/projects.$projectName.tsx" },
  { path: "projects/:projectName/image/:imageName", file: "routes/projects.$projectName.image.$imageName.ts" },
] satisfies RouteConfig;
