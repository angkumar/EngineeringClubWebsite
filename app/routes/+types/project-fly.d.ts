import type * as ReactRouter from "react-router";

declare module "react-router" {
  interface RouteMeta {
    // Define any custom meta properties for your routes here
  }
}

export namespace Route {
  export type LoaderArgs = ReactRouter.LoaderArgs;
  export type ActionArgs = ReactRouter.ActionArgs;
  export type ShouldRevalidateFunction = ReactRouter.ShouldRevalidateFunction;
  export type LinksFunction = ReactRouter.LinksFunction;
  export type MetaArgs = ReactRouter.MetaArgs;
  export type ErrorBoundaryProps = ReactRouter.ErrorBoundaryProps;
}
