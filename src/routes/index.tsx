// src/routes/index.tsx
import { createBrowserRouter, RouteObject } from "react-router-dom";
import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/Login";
import FormComponents from "../pages/FormComponents";

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
  {
    path: "/formComponents",
    element: <FormComponents />
  },
  {
    path: "/login",
    element: <Login />,
  }
];

export const router = createBrowserRouter(routes);
