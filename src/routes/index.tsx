// routes/index.tsx
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";
const Home = lazy(() => import("../pages/Home"));
const MainLayout = lazy(() => import("../layouts/MainLayout"));
const Login = lazy(() => import("../pages/Login"));
const FormComponents = lazy(() => import("../pages/FormComponents"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <MainLayout />
      </Suspense>
    ),
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Home />
          </Suspense>
        )
      },
    ],
  },
  {
    path: "/formComponents",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <FormComponents />
      </Suspense>
    )
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Login />
      </Suspense>
    )
  }
];


const router = createBrowserRouter(routes);
export default router;