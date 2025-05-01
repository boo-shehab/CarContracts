// src/routes/index.tsx
import { createBrowserRouter, RouteObject } from "react-router-dom";
import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
